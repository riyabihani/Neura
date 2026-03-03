// defines a queue names "note-summary" -> API pushes jobs here and worker listens to same queue
import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const noteSummaryQueue = new Queue("note-summary", { connection }); 