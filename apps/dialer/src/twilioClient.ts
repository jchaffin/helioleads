export interface OutboundCallOptions {
  to: string;
  from: string;
  webhookUrl: string;
}

export async function dialOutbound(_opts: OutboundCallOptions): Promise<{ callSid: string }> {
  // TODO: Use Twilio REST API to create call
  return { callSid: "CA_placeholder" };
}
