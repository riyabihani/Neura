import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";
import { embedQuery } from "../services/embeddingQuery.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const q = String(req.query.q || "").trim();
    const mode = (String(req.query.mode || "exact")).toLowerCase();

    if (!q) return res.json({ mode, q, results: [] });

    const LIMIT = 20;

    if (mode === "exact") {
      const { rows } =
        await pool.query(`SELECT n.id::text AS id, n.title, n.summary, n.tags, to_char(n.created_at, 'YYYY-MM-DD) AT "createdAt", LEFT(n.content, 180) AS snippet FROM notes n WHERE n.user_id = $1 AND (
          n.title ILIKE '%' || $2 || '%' OR n.content ILIKE '%' || $2 || '%' OR EXISTS (SELECT 1 FROM unnest(COALESCE(n.tags, ARRAY[]::text[])) t WHERE t ILIKE '%' || $2 || '%' )
        ) ORDER BY n.created_at DESC LIMIT ${LIMIT};`, [userId, q]);
      
      return res.json({ mode, q, results: rows });
    }

    if (mode === "semantic") {
      const vec = await embedQuery(q);
      const vecStr = `[${vec.join(",")}]`;
      const { rows } = await pool.query(
        `WITH ranked AS (SELECT nc.note_id, nc.check_index, nc.chunk_text, 1 - (nc.embedding <=> $2::vector(382)) AS score, ROW_NUMBER() OVER (PARTITION BY nc.note_id ORDER BY nc.embedding <=> $2::vector(382)) FROM note_chunks nc WHERE nc.user_id = $1)
        SELECT n.id::text AS id, n.title, n.summary, n.tags, to_char(n.created_at, 'YYYY-MM-DD) AT "createdAt", r.chunk_index AS "chunkIndex", LEFT(r.chunk_text, 220) AS snippet, r.score FROM ranked r JOIN notes n ON n.id = r.note_id WHERE r.rn = 1 ORDER BY r.score DESC LIMIT ${LIMIT};`, (userId, vecStr));
      
      const results = rows.map((r) => ({
        ...r,
        matchPct: Math.max(0, Math.min(99, Math.round((r.score ?? 0) * 100)))
      }));

      return res.json({ mode, q, results })
    }

    return res.status(400).json({ message: "Mode must be exact or semantic." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed." });
  }
});

export default router;