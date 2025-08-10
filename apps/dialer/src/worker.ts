// apps/dialer/src/worker.ts
import { Worker } from "bullmq";
import { withinWindow, nextLegalTime } from "./schedule";
import { startCall } from "../twilioClient";

new Worker("outbound", async job => {
  const lead = job.data;
  if (!withinWindow(lead)) {
    const runAt = nextLegalTime(lead);
    await job.moveToDelayed(runAt.toMillis());
    return;
  }
  await startCall(lead);
}, { concurrency: 8 });