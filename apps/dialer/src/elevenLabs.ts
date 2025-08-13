import { Readable } from 'node:stream';
import { ElevenLabs } from 'elevenlabs';

export type ElevenOpts = {
  apiKey?: string;
  voiceId?: string; // required
  modelId?: string; // e.g. 'eleven_multilingual_v2'
  optimizeStreamingLatency?: 0 | 1 | 2 | 3 | 4;
  outputFormat?: 'mp3_44100' | 'pcm_16000' | 'pcm_8000' | 'ulaw_8000';
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
};

export class Eleven {
  private client: ElevenLabs;
  private voiceId: string;
  private modelId: string;
  private optimize?: 0 | 1 | 2 | 3 | 4;
  private output: ElevenOpts['outputFormat'];
  private settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };

  constructor(opts: ElevenOpts = {}) {
    const apiKey = opts.apiKey ?? process.env.ELEVENLABS_API_KEY ?? '';
    if (!apiKey) throw new Error('ELEVENLABS_API_KEY missing');
    this.voiceId = opts.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? '';
    if (!this.voiceId) throw new Error('ELEVENLABS_VOICE_ID missing');

    this.client = new ElevenLabs({ apiKey });
    this.modelId = opts.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';
    this.optimize = opts.optimizeStreamingLatency ?? 3;
    this.output = opts.outputFormat ?? 'ulaw_8000';
    this.settings = {
      stability: opts.stability ?? 0.4,
      similarity_boost: opts.similarityBoost ?? 0.7,
      style: opts.style ?? 0.0,
      use_speaker_boost: opts.speakerBoost ?? true,
    };
  }

  // low-latency stream
  async toStream(text: string): Promise<Readable> {
    if (!text?.trim()) throw new Error('empty text');
    const res = await this.client.textToSpeech.stream(this.voiceId, {
      text,
      model_id: this.modelId,
      voice_settings: this.settings,
      optimize_streaming_latency: this.optimize,
      output_format: this.output,
    });
    // @ts-ignore Node 18+: Readable.fromWeb
    return Readable.fromWeb(res.body as any);
  }
}

export function createTTS(opts: ElevenOpts = {}) {
  const eleven = new Eleven(opts);
  return {
    async *stream(text: string): AsyncIterable<Uint8Array> {
      const rs = await eleven.toStream(text);
      for await (const chunk of rs) {
        const buf: Buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        yield new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      }
    },
    close() {},
  };
}
