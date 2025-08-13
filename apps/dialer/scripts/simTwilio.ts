/**
 * Simple Twilio Media Streams simulator for local testing.
 *
 * Usage:
 *   1) Run the dialer: npm run dev:dialer
 *   2) In another terminal: npx tsx apps/dialer/scripts/simTwilio.ts
 *
 * It connects to ws://localhost:4000/ws, sends a 'start' event, then a few
 * silent mu-law frames, and logs any outbound media or marks from the server.
 */

import WebSocket from 'ws';

const url = process.env.SIM_WS_URL ?? 'ws://localhost:4000/ws';

// Generate a short buffer of silence in 8kHz mu-law (approx)
function ulawSilence(len = 160) {
  // 20ms at 8kHz ≈ 160 samples
  // For silence, mu-law 0xFF is a common no-op; but Twilio accepts various encodings of silence.
  const buf = Buffer.alloc(len, 0xFF);
  return buf;
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function run() {
  const ws = new WebSocket(url);
  ws.on('open', async () => {
    console.log('[sim] connected');
    // Send start event with sampleRate
    ws.send(JSON.stringify({
      event: 'start',
      start: { streamSid: 'SIM123', mediaFormat: { sampleRate: 8000, encoding: 'audio/x-mulaw' } },
    }));

    // Send a few silent frames
    for (let i = 0; i < 10; i++) {
      const payload = ulawSilence(160);
      ws.send(JSON.stringify({ event: 'media', media: { payload: payload.toString('base64') } }));
      await sleep(20);
    }

    // Mark and stop
    ws.send(JSON.stringify({ event: 'mark', mark: { name: 'simulated_mark' } }));
    await sleep(100);
    ws.send(JSON.stringify({ event: 'stop' }));
    await sleep(100);
    ws.close();
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('[sim] recv:', msg);
    } catch {
      console.log('[sim] recv (raw):', data.toString());
    }
  });

  ws.on('error', (err) => console.error('[sim] error', err));
  ws.on('close', () => console.log('[sim] closed'));
}

run().catch((e) => {
  console.error('[sim] failed', e);
  process.exit(1);
});

