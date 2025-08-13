export const runtime = "nodejs";

export async function POST(_req: Request) {
  const wsUrl = process.env.DIALER_WS_URL ?? "ws://localhost:4000/ws";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say voice="Polly.Matthew-Neural">Connecting you now.</Say>
  <Connect><Stream url="${wsUrl}"/></Connect>
  </Response>`;
  return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
}
