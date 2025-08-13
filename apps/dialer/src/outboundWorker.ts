import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis';
import { dialOutbound } from './twilioClient';

type DialJob = {
  leadId: string;
  phone: string;
  attempt?: number;
};

async function processJob(job: Job<DialJob>) {
  const { leadId, phone } = job.data;
  job.log(`Starting outbound dial for ${leadId} -> ${phone}`);
  const from = process.env.TWILIO_PHONE_NUMBER || '';
  const baseUrl = process.env.DASHBOARD_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  if (!from) throw new Error('TWILIO_PHONE_NUMBER not set');
  if (!baseUrl) throw new Error('DASHBOARD_BASE_URL or NEXT_PUBLIC_BASE_URL not set');
  const webhookUrl = new URL('/api/voice', baseUrl).toString();
  const statusCallbackUrl = new URL('/api/voice-status', baseUrl).toString();

  const { callSid } = await dialOutbound({
    to: phone,
    from,
    webhookUrl,
    statusCallbackUrl,
    machineDetection: 'DetectMessageEnd',
    timeoutSec: 25,
  });

  job.log(`Placed call SID ${callSid}`);
  return { ok: true, callSid };
}

const w = new Worker<DialJob>('outbound', processJob, { connection: redisConnection() });
w.on('ready', () => console.log('[worker] outbound ready'));
w.on('error', (err) => console.error('[worker] error', err));
w.on('failed', (job, err) => console.error('[worker] job failed', job?.id, err));
w.on('completed', (job) => console.log('[worker] job completed', job.id));

process.on('SIGINT', async () => { try { await w.close(); } finally { process.exit(0); } });
process.on('SIGTERM', async () => { try { await w.close(); } finally { process.exit(0); } });
