import { pipeline } from "@xenova/transformers";

let extractorPromise;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractorPromise;
}

function normalizeWhitespace(text) {
  return (text || "").replace(/\s+/g, " ").trim()
}

function wordCount(text) {
  const t = (text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function chunkByWords(text, chunkWords = 250, overlappingWords = 50) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkWords, words.length);
    chunks.push(words.slice(start, end).join(" "));
    if (end === words.length) break;
    start = Math.max(0, end - overlappingWords);
  }
  return chunks;
}

function toPgVector(vec) {
  return `[${vec.join(",")}]`;
}

async function embedText(text) {
  const extractor = await getExtractor();
  const out = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}

export async function embeddingsForNote({ pool, userId, noteId, content }) {
  const clean = normalizeWhitespace(content);
  const wc = wordCount(clean);

  await pool.query(`DELETE FROM note_chunks WHERE note_id = $1 AND user_id = $2`, [noteId, userId]);

  if (wc < 5) return { skipped: true, mode: "none", words: wc };

  const chunks = wc <= 300 ? [clean] : chunkByWords(clean, 250, 50);
  
  for (let i = 0; i < chunks.length; i++) {
    const vec = await embedText(chunks[i]);
    const vecStr = toPgVector(vec);
    await pool.query(`INSERT INTO note_chunks (user_id, note_id, chunk_index, chunk_text, embedding, embedding_model, embedded_at) VALUES ($1, $2, $3, $4, $5::vector(384), 'Xenove/all-MiniLM-L6-v2', Now())`, [userId, noteId, i, chunks[i], vecStr]);
  }

  return { skipped: false, mode: wc <= 300 ? "single_chunk" : "multi_chunk", words: wc, chunkCount: chunks.length };
}