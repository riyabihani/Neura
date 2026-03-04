export async function computeRelatedNotes ({ pool, userId, noteId, limit = 10 }) {
  const { rows } = await pool.query(`
    WITH candidates AS (SELECT other.note_id AS related_note_id, (src.embedding <=> other.embedding) AS dist 
    FROM note_chunks src JOIN note_chunks other 
    ON other.user_id = src.user_id AND other.note_id <> src.note_id
    WHERE src.user_id = $1 AND src.note_id = $2),
    ranked AS (
      SELECT related_note_id, COUNT(*) FILTER (WHERE dist < 0.35) AS hits, MIN(dist) AS best_dist FROM candidates GROUP BY related_note_id 
    )
    SELECT related_note_id FROM ranked WHERE hits > 0 ORDER BY hits DESC, best_dist ASC LIMIT $3;` ,[userId, noteId, limit]
  )

  const relatedIds = rows.map((r) => r.related_note_id);

  await pool.query(`DELETE FROM note_relations WHERE note_id = $1`, [noteId]);

  if (relatedIds.length > 0) {
    const values = [];
    const params = [];
    let p = 1;

    for (const rid of relatedIds) {
      values.push(`($${p++}, $${p++})`);
      params.push(noteId, rid);
    }

    await pool.query(`INSERT INTO note_relations (note_id, related_note_id) VALUES ${values.join(", ")} ON CONFLICT DO NOTHING;`, params);
  }

  return relatedIds;
}