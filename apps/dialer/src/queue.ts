export interface DialJob {
  leadId: string;
  phone: string;
  attempt: number;
}

export async function enqueueDial(_job: DialJob): Promise<void> {
  // TODO: Enqueue job in BullMQ/Redis
  console.log("[queue] enqueueDial called");
}
