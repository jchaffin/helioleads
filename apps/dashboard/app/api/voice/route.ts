// apps/dashboard/app/api/voice/route.ts
export const runtime = "nodejs";
import { loadSecrets } from "@helioleads/shared";

export async function POST() {
  await loadSecrets({ secretId: process.env.AWS_SECRET_ID, region: process.env.AWS_REGION });
  const host = process.env.NEXT_PUBLIC_BASE_URL!.replace(/^https?:\/\//, "");
  const xml = `<Response><Start><Stream url="wss://${host}/call-stream"/></Start><Pause length="3600"/></Response>`;
  return new Response(xml, { headers: { "Content-Type": "text/xml" } });
}
export async function POST(_req: Request) {
  const wsUrl = process.env.DIALER_WS_URL ?? "ws://localhost:4000/ws";
  const twiml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<Response>',
    '  <Pause length="1"/>',
    '  <Say voice="Polly.Matthew-Neural">Connecting you now.</Say>',
    `  <Connect><Stream url="${wsUrl}"/></Connect>`,
    '</Response>'
  ].join('\n');
  return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
}
