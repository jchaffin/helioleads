import { EventEmitter } from "events";
import { RealtimeAgent } from "@openai/agents/realtime";

export type CreateRealtimeOptions = {
  apiKey?: string;
  model?: string; // e.g. "gpt-4o-realtime-preview"
  instructions?: string;
  sampleRate?: number; // incoming audio sample rate
  useServerVAD?: boolean;
  vad?: { threshold?: number; prefixPaddingMs?: number; silenceMs?: number };
};

export function createRealtime(opts: CreateRealtimeOptions = {}) {
  const apiKey = opts.apiKey ?? process.env.OPENAI_API_KEY ?? "";
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const model = opts.model ?? process.env.OPENAI_REALTIME_MODEL ?? "gpt-4o-realtime-preview";
  const instructions =
    opts.instructions ??
    "You are a sales dialer agent. Keep replies concise and natural. Ask qualifying questions.";

  const sr = (() => {
    const v = opts.sampleRate ?? Number(process.env.OPENAI_REALTIME_SAMPLE_RATE || 16000);
    return Number.isFinite(v) && v > 0 ? v : 16000;
  })();
  const useVad = (() => {
    const raw = (opts.useServerVAD ?? (process.env.OPENAI_REALTIME_USE_SERVER_VAD ?? 'true')).toString().toLowerCase();
    return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'y';
  })();
  const vadThreshold = Number(process.env.OPENAI_REALTIME_VAD_THRESHOLD ?? opts.vad?.threshold ?? 0.5);
  const vadPrefix = Number(process.env.OPENAI_REALTIME_VAD_PREFIX_MS ?? opts.vad?.prefixPaddingMs ?? 300);
  const vadSilence = Number(process.env.OPENAI_REALTIME_VAD_SILENCE_MS ?? opts.vad?.silenceMs ?? 500);

  const agent = new RealtimeAgent({
    apiKey,
    model,
    instructions,
    sampleRate: sr,
    enableServerVAD: useVad,
    vad: {
      threshold: vadThreshold,
      prefix_padding_ms: vadPrefix,
      silence_duration_ms: vadSilence,
    },
  });
  const bus = new EventEmitter();
  let connected = false;
  let textBuf = "";

  // Connect immediately
  // @ts-ignore - vendor shim provides connect
  agent.connect?.().then(() => (connected = true)).catch(() => (connected = false));

  agent.on?.("message", (msg: any) => {
    try {
      const t = msg?.type as string | undefined;
      if (!t) return;
      // Collect any text deltas
      if (t.includes("delta") && typeof msg.delta === "string") {
        textBuf += msg.delta;
      }
      // Heuristic: completed or no more content
      if (t.includes("completed") && textBuf) {
        bus.emit("response", { text: textBuf });
        textBuf = "";
      }
    } catch {
      /* ignore */
    }
  });

  function sendAudio(pcm: Buffer) {
    // Pass-through: Twilio provides base64 PCM at 8kHz; many models expect 16k/24k.
    // Resampling can be added later; for now forward raw base64.
    const b64 = pcm.toString("base64");
    // @ts-ignore - vendor shim provides append
    agent.appendAudioBase64?.(b64);
  }

  function commitTurn() {
    // @ts-ignore
    agent.commitAudio?.();
    // @ts-ignore
    agent.requestResponse?.();
  }

  function close() {
    // @ts-ignore
    agent.close?.();
  }

  const api = {
    on: bus.on.bind(bus),
    off: bus.off.bind(bus),
    sendAudio,
    commitTurn,
    close,
    setInstructions(instructions: string) {
      // @ts-ignore
      agent.updateInstructions?.(instructions);
    },
  } as {
    on(event: "response", cb: (msg: { text: string }) => void): void;
    off(event: "response", cb: (msg: { text: string }) => void): void;
    sendAudio(pcm: Buffer): void;
    commitTurn(): void;
    close(): void;
    setInstructions(instructions: string): void;
  };

  // expose underlying agent for specialized methods
  // @ts-ignore
  (api as any).agent = agent;
  return api;
}
