import { pipeline } from "@xenova/transformers";

let extractorPromise;

async function getExtractor() {
  if(!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractorPromise;
}

export async function embedQuery(text) {
  const extractor = await getExtractor();
  const out = await extractor(String(text || ""), { pooling: "mean", normalize: true });
  return Array.from(out.data);
}