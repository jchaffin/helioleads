// apps/dialer/src/schedule/enqueue.ts
import { Queue } from "bullmq";
import { nextLegalTime } from "./when";
export const outbound = new Queue("outbound");

export async function enqueueLead(lead:any) {
  const runAt = nextLegalTime(lead);
  await outbound.add("call", lead, { delay: Math.max(0, runAt.toMillis() - Date.now()) });
}