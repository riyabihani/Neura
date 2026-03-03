import "dotenv/config";
import { noteSummaryQueue } from "./noteSummaryQueue.js";

async function main() {
  const job = await noteSummaryQueue.add("summarize-note", { noteId: 123, userId: 1});
  console.log("Enqueued job ID:", job.id);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
})