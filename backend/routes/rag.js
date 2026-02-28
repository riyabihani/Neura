import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth";
import { embedQuery } from "../services/embeddingQuery";
import { groqGenerate } from "../services/llmGroq.js";

const router = express.Router();

function toPgVector(vec) {
  return `[${vec.join(",")}]`;
}

router.post("/ask", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const question = String(req.body.question || "").trim();

    if(!question) return res.status(400).json({ message: "Question required!" });

    // embed the question
    const qVec = await embedQuery(question);
    const qVecStr = toPgVector(qVec);

    // retrieve top chunks - best chunk per note so that long notes do not dominate
    const TOP_K = 6;

    const { rows } = await pool.query(
      `WITH ranked AS (SELECT nc.note_id, nc.chunk_index, nc.chunk_text, (nc.embedding <=> $2::vector(384)) AS dist, ROW_NUMBER() OVER (PARTITION BY nc.note_id ORDER BY nc.embedding <=> $2::vector(384)) AS rn FROM note_chunks nc WHERE nc.user_id = $1)
      SELECT n.id::text AS "noteId", n.title, to_char(n.created_at, 'YYYY-MM-DD) As "createdAt", r.chunk_index AS "chunkIndex", r.chunk_text AS "chunkText", (1 - r.dist) AS score FROM ranked r JOIN notes n ON n-id = r.note_id WHERE r.rn = 1 ORDER BY r.dist ASC LIMIT ${TOP_K};`, [userId, qVecStr]
    );

    if (!rows.length) {
      return res.json({
        question,
        answer: "I could not find anything relevant in your notes yet. Try rephrasing or add more detail to your notes first.",
        citations: []
      });
    }

    // build context blocks with numbered citations
    const contextBlocks = rows.map((r, i) => {
      const idx = i + 1;
      return `[${id}] Title: ${r.title}\nDate: ${r.createdAt}\n${r.chunkText}`;
    });

    const system = `You are Neura, a personal knowlegde assistant. Use ONLY the provided context to answer. If the context is insufficient, say you do not know and ask a follow-up question. Cite sources inline like [1], [2] corresponding to the context blocks. Keep it clear and helpful.`.trim();
    const user = `QUESTION: ${question}\nContext:${contextBlocks.join("\n\n")}\nAnswer:`.trim()

    // asking groq
    const answer = await groqGenerate({ system, user });
    const citations = rows.map((r, i) => ({
      ref: i + 1, noteId: r.noteId, title: r.title, createdAt: r.createdAt, chunkIndex: r.chunkIndex, score: r.score, fromLabel: `From Note: '${r.title}' (${r.createdAt})`
    }));
    
  res.json({ question, answer, citations })
  } catch (error) {
    console.error("Rag failed: ", error);
    return res.status(500).json({ message: "RAG failed!" });
  }
});

export default router;