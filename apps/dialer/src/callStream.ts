import type { FastifyInstance } from "fastify";
import type { RawData, WebSocket } from "ws";
import { createRealtime } from "./openaiRealtime";
import { createTTS } from "./elevenLabs";
import { muLawToPCM16, resamplePCM16Mono, pcm16ToBase64 } from "./audio";
import { buildRealtimeInstructions, initialState } from "./scriptEngine";
import { metrics as m } from './metrics';

export function registerCallStreamRoute(app: FastifyInstance) {
  const handler = async (connection: any, req: any) => {
    const ws = connection.socket as WebSocket;
    let alive = true;

    // Defaults; may be updated on Twilio 'start' event
    let twilioRate = 8000;
    const oaiRate = Number(process.env.OPENAI_REALTIME_SAMPLE_RATE || 16000); // target for Realtime
    const oai = await createRealtime({ sampleRate: oaiRate });

    // Log per-connection audio + VAD configuration
    const useVadRaw = (process.env.OPENAI_REALTIME_USE_SERVER_VAD ?? 'true').toString().toLowerCase();
    const useVad = useVadRaw === '1' || useVadRaw === 'true' || useVadRaw === 'yes' || useVadRaw === 'y';
    req.log.info({ twilioRate, oaiRate, serverVAD: useVad }, '[callStream] audio config');
    const tts = createTTS({ outputFormat: 'ulaw_8000' });

    // Provide strong system instructions so the model infers B2B installer context
    const instr = buildRealtimeInstructions(initialState());
    // @ts-ignore
    oai.setInstructions?.(instr);

    // Simple sleep utility for retry/backoff
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function sendWithRetry(payload: string, attempts = 3) {
      for (let i = 1; i <= attempts; i++) {
        if (!alive) return false;
        try {
          if ((ws as any).readyState !== (ws as any).OPEN) throw new Error('ws not open');
          ws.send(payload);
          m.wsSendAttempts.inc({ result: 'ok' });
          return true;
        } catch (err) {
          if (i === attempts) {
            m.wsSendAttempts.inc({ result: 'fail' });
          }
          if (i === attempts) return false;
          await sleep(Math.min(20 * 2 ** (i - 1), 200));
        }
      }
      return false;
    }

    async function sendEvent(obj: any) { return sendWithRetry(JSON.stringify(obj)); }

    // Heartbeat back to Twilio (helps keep the stream alive)
    const hb = setInterval(() => {
      if (!alive) return;
      sendEvent({ event: "mark", mark: { name: "tick" } });
    }, 5000);

    // Model → TTS → Twilio
    oai.on("response", async (msg: any) => {
      if (!msg?.text) return;
      // Hint Twilio to clear any playback buffer before we stream fresh audio
      await sendEvent({ event: "clear" });

      // Chunk outbound audio to ~20ms frames (160 bytes at 8kHz mu-law)
      let buf = Buffer.alloc(0);
      const FRAME = 160; // 20ms @ 8kHz mu-law
      for await (const chunk of tts.stream(msg.text)) {
        if (!alive) break;
        const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        buf = Buffer.concat([buf, b]);
        while (buf.length >= FRAME) {
          const frame = buf.subarray(0, FRAME);
          buf = buf.subarray(FRAME);
          const payload = frame.toString("base64");
          const ok = await sendEvent({ event: "media", media: { payload } });
          if (ok) m.ttsFramesOut.inc();
          if (!ok || !alive) break;
        }
      }
      if (alive && buf.length > 0) {
        // pad last partial frame with silence to keep frame size consistent
        const padded = Buffer.alloc(FRAME, 0xff);
        buf.copy(padded, 0, 0, Math.min(buf.length, FRAME));
        if (await sendEvent({ event: "media", media: { payload: padded.toString("base64") } })) m.ttsFramesOut.inc();
      }
      await sendEvent({ event: "mark", mark: { name: "tts_end" } });
    });

    m.wsConnectionsOpened.inc();

    ws.on("message", (raw: RawData) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.event === "connected") {
          req.log.info({ connected: data.streamSid || data.streamSid }, "[callStream] ws connected");
        } else if (data.event === "start") {
          // Twilio provides media format in start event
          const sr = Number(data?.start?.mediaFormat?.sampleRate ?? 8000);
          if (Number.isFinite(sr) && sr > 0) twilioRate = sr;
          req.log.info({ streamSid: data?.start?.streamSid, sr: twilioRate }, "[callStream] start");
        } else if (data.event === "media") {
          m.wsMediaFramesIn.inc();
          const mu = Buffer.from(data.media.payload, "base64");
          // Twilio payload is mu-law 8kHz; convert -> PCM16 8kHz
          const pcm8 = muLawToPCM16(new Uint8Array(mu));
          // Resample -> PCM16 16kHz for Realtime
          const pcm16 = resamplePCM16Mono(pcm8, twilioRate, oaiRate);
          const b64 = pcm16ToBase64(pcm16);
          // Forward base64 PCM16 to Realtime API
          // @ts-ignore vendor shim
          (oai as any).agent?.appendAudioBase64?.(b64) ?? oai.sendAudio?.(Buffer.from(mu));
        } else if (data.event === "mark") {
          req.log.debug({ mark: data?.mark?.name }, "[callStream] mark");
        } else if (data.event === "dtmf") {
          req.log.info({ dtmf: data?.dtmf?.digits }, "[callStream] dtmf");
        } else if (data.event === "stop") {
          cleanup();
        }
      } catch { /* ignore */ }
    });

    // Rely on OpenAI server VAD; no manual commit loop

    ws.once("close", () => { m.wsConnectionsClosed.inc(); cleanup(); });
    ws.once("error", (err) => { try { req.log.error({ err }, "[callStream] ws error"); } catch {} ; cleanup(); });

    function cleanup() {
      if (!alive) return;
      alive = false;
      clearInterval(hb);
      try { oai.close(); } catch {}
      try { tts.close?.(); } catch {}
      try { ws.close(); } catch {}
    }
  };

  app.get("/call-stream", { websocket: true }, handler);
  app.get("/ws", { websocket: true }, handler);
}
