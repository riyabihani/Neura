import express from "express";
import pool from "../config/db.js"
import { protect } from "../middleware/auth.js"
import { embeddingsForNote } from "../services/embeddings.js";
import { noteSummaryQueue } from "../queues/noteSummaryQueue.js";

const router = express.Router();

// get all the notes
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id
    const { rows } = await pool.query(`SELECT id, title, content, status, kind, tags, summary, key_points AS "keyPoints", entities, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS "createdAtISO" FROM notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200`, [userId]);

    // to make sure id goes to frontend in string format
    const notes = rows.map((r) => ({...r, id: String(r.id)}));
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// get note by its id
router.get("/:id", protect, async (req, res) => {
  try{
    const userId = req.user.id;
    const noteId = Number(req.params.id);

    if (Number.isNaN(noteId)) {
      return res.status(400).json({ message: "Invalid note id."});
    }

    const { rows } = await pool.query(`SELECT id, title, content, status, kind, tags, summary, key_points AS "keyPoints", entities, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS "createdAtISO" FROM notes WHERE id = $1 AND user_id = $2`, [noteId, userId]);

    if (!rows[0]) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch note." });
  }
});

// related ids of a certain note id
router.get("/:id/related", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = Number(req.params.id);

    if (Number.isNaN(noteId)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const note = await pool.query(`SELECT 1 FROM notes WHERE id = $1 AND user_id = $2`, [noteId, userId]);
    if(!note.rowCount) return res.status(404).json({ message: "Note not found." });
    
    const { rows } = await pool.query(`SELECT n.id::text AS id, n.title, n.content, n.status, n.kind, n.tags, n.summary, n.key_points AS "keyPoints", n.entities, to_char(n.created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS "createdAtISO" FROM note_relations r JOIN notes n ON n.id = r.related_note_id WHERE r.note_id = $1 AND n.user_id = $2 ORDER BY n.created_at DESC LIMIT 10;`, [noteId, userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch related notes."});
  }
});

// delete a note using id
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = Number(req.params.id);

    if (Number.isNaN(noteId)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const result = await pool.query(`DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id;`, [noteId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.json({ message: "Note deleted successfully. "});
  } catch (error) {
    console.error(error);
    res.status(505).json({ message: "Failed to delete note." });
  }
});

// create a note
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, kind = "text" } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content is required! "});
    }

    const { rows } = await pool.query(`INSERT INTO notes (user_id, title, content, kind, status) VALUES ($1, $2, $3, $4, 'Queued'::note_status) RETURNING id::text AS id, title, content, status, kind, tags, summary, key_points AS "keyPoints", entities, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS "createdAtISO";`, [userId, title.trim(), content.trim(), kind]);
    
    const note = rows[0];

    const job = await noteSummaryQueue.add("summarize-note", 
      { noteId: Number(note.id, userId) },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 }
      }
    );

    await pool.query(`UPDATE notes SET summary_job_id=$1 WHERE id=$2 AND user_id=$3`, 
      [String(job.id), Number(note.id), userId]
    );

    res.status(201).json(note);

    embeddingsForNote({pool, userId, noteId:Number(note.id), content: note.content}).catch((e) => console.error("Embedding / chunking failed: ", e))
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create note." });
  }
})

export default router;