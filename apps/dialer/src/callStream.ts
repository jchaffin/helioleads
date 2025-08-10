import type { FastifyInstance } from "fastify";
import type { RawData, WebSocket } from "ws";
import { createRealtime } from "./openaiRealtime";
import { createTTS } from "./elevenLabs";

export function registerCallStreamRoute(app: FastifyInstance) {
  app.get("/call-stream", { websocket: true }, async (connection, req) => {
    const ws = connection.socket as WebSocket;
    let alive = true;

    const sampleRate = 8000;
    const oai = await createRealtime({ sampleRate });
    const tts = createTTS({ sampleRate });

    // Heartbeat back to Twilio
    const hb = setInterval(() => alive && ws.send(JSON.stringify({ event: "mark", mark: { name: "tick" } })), 5000);

    // Model → TTS → Twilio
    oai.on("response", async (msg: any) => {
      if (!msg?.text) return;
      for await (const chunk of tts.stream(msg.text)) {
        if (!alive) break;
        ws.send(JSON.stringify({ event: "media", media: { payload: Buffer.from(chunk).toString("base64") } }));
      }
      ws.send(JSON.stringify({ event: "mark", mark: { name: "tts_end" } }));
    });

    ws.on("message", (raw: RawData) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.event === "media") {
          const pcm = Buffer.from(data.media.payload, "base64");
          oai.sendAudio(pcm);
        } else if (data.event === "stop") {
          cleanup();
        }
      } catch { /* ignore */ }
    });

    // Commit turns periodically; replace with VAD when ready
    const commit = setInterval(() => oai.commitTurn(), 1200);

    ws.once("close", cleanup);
    ws.once("error", cleanup);

    function cleanup() {
      if (!alive) return;
      alive = false;
      clearInterval(hb);
      clearInterval(commit);
      try { oai.close(); } catch {}
      try { tts.close?.(); } catch {}
    }
  });
}