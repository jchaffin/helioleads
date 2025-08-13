// apps/dialer/src/schedule/enqueue.ts
import { Queue } from "bullmq";
import { nextLegalTime } from "./when";
import { redisConnection } from "../redis";
export const outbound = new Queue("outbound", { connection: redisConnection() });

export async function enqueueLead(lead:any) {
  const runAt = nextLegalTime(lead);
  await outbound.add("call", lead, { delay: Math.max(0, runAt.toMillis() - Date.now()) });
}
