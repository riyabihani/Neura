import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "./redis.js";
import pool from "../config/db.js";
import { groqGenerate } from "../services/llmGroq.js";

function buildPrompt(noteText) {
  return `Return valid JSON only with this structure: 
  {
    "summary": "3-5 sentence summary",
    "keyPoints": ["3-7 bullet points"],
    "tags": ["3-10 short tags"],
  }
  
  Text: ${noteText}`.trim();
}

function safeJsonParse(raw) {
  const trimmed = String(rew || "").trim();
  const noFences = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(noFences);
  } catch {}

  const start = noFences.indexOf('{');
  const end = noFences.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(noFences.slice(start, end + 1));
  }

  throw new Error("LLm returned invalid JSON")
}

new Worker("note-summry",
  async (job) => {
    const { noteId, userId } = job.data;
    console.log("Processing note:", noteId);

    try {
      await pool.query(`UPDATE notes SET status='Processing'::note_status WHERE id=$1 AND user_id=$2`, [noteId, userId]);
      const r = await pool.query(`SELECT content FROM notes WHERE id=$1 AND user_id=$2`, [noteId, userId]);
      if (r.rowCount === 0) {
        throw new Error("Note not found or unauthorized!");
      }

      const content = String(r.rows[0].content || "").trim();
      if (!content) {
        throw new Error("Empty note content");
      }

      const raw = await groqGenerate({
        system: "You are a helpful assistant that outputs JSON only.",
        user: buildPrompt(content)
      });

      const parsed = safeJsonParse(raw);
      const summary = String(parsed.summary || "").trim();
      const keyPoints = Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map(String) : [];
      const tags = Array.isArray(parsed.tags) ? parsed.tags.map(String) : [];

      await pool.query(`UPDATE notes SET summary=$1, key_points=$2, tags=$3, status='Completed'::note_status WHERE id=$4 AND user_id=$5`, [summary, keyPoints, tags, noteId, userId]);

      console.log("Completed note: ", noteId);

      return { success: true };
    } catch (error) {
      console.error("Job failed for noteId: ", noteId, error.message);

      await pool.query(`UPDATE notes SET status='Failed'::note_status WHERE id=$1 AND user_id=$2`, [noteId, userId]);
      throw error;
    }
  }, {
    connection,
    concurrency: 2
  }
)
