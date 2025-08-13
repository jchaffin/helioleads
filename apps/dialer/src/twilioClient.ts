import twilio, { Twilio } from 'twilio';

export interface OutboundCallOptions {
  to: string;
  from: string;
  webhookUrl: string;
  statusCallbackUrl?: string;
  machineDetection?: 'Enable' | 'DetectMessageEnd';
  timeoutSec?: number;
}

function getClient(): Twilio {
  const sid = process.env.TWILIO_ACCOUNT_SID || '';
  const token = process.env.TWILIO_AUTH_TOKEN || '';
  if (!sid || !token) throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
  return twilio(sid, token);
}

export async function dialOutbound(opts: OutboundCallOptions): Promise<{ callSid: string }> {
  const client = getClient();
  const { to, from, webhookUrl, statusCallbackUrl, machineDetection, timeoutSec } = opts;

  const createOpts: any = {
    to,
    from,
    url: webhookUrl,
    method: 'POST',
    statusCallback: statusCallbackUrl,
    statusCallbackMethod: 'POST',
    machineDetection,
    timeout: timeoutSec ?? 20,
  };

  // Clean up undefined values
  Object.keys(createOpts).forEach((k) => createOpts[k] === undefined && delete createOpts[k]);

  const call = await client.calls.create(createOpts);
  return { callSid: call.sid };
}
