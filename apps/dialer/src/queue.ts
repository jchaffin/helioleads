import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export interface DialJob {
  leadId: string;
  phone: string;
  attempt: number;
}

const dialQueue = new Queue<DialJob>('outbound', { connection: redisConnection() });

export async function enqueueDial(job: DialJob): Promise<void> {
  await dialQueue.add('call', job, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
  });
}
