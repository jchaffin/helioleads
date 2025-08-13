import { EventEmitter } from 'events';
import WebSocket from 'ws';

export type RealtimeAgentOptions = {
  apiKey: string;
  model: string;
  instructions?: string;
  sampleRate?: number;
  enableServerVAD?: boolean;
  vad?: {
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
};

export class RealtimeAgent extends EventEmitter {
  private ws?: WebSocket;
  private opened = false;

  constructor(private opts: RealtimeAgentOptions) {
    super();
  }

  async connect() {
    const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(this.opts.model)}`;
    this.ws = new WebSocket(url, {
      headers: {
        Authorization: `Bearer ${this.opts.apiKey}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    });
    await new Promise<void>((resolve, reject) => {
      this.ws!.once('open', () => {
        this.opened = true;
        resolve();
      });
      this.ws!.once('error', (e) => reject(e));
    });
    this.ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'output_audio.delta' && msg.delta) {
          this.emit('outputAudio', msg.delta as string);
        }
        this.emit('message', msg);
      } catch (err) {
        this.emit('error', err as any);
      }
    });
    const session: any = {};
    if (this.opts.instructions) session.instructions = this.opts.instructions;
    if (this.opts.sampleRate) {
      session.input_audio_format = { type: 'pcm16', sample_rate: this.opts.sampleRate, channels: 1 };
    }
    if (this.opts.enableServerVAD) {
      session.turn_detection = {
        type: 'server_vad',
        threshold: this.opts.vad?.threshold ?? 0.5,
        prefix_padding_ms: this.opts.vad?.prefix_padding_ms ?? 300,
        silence_duration_ms: this.opts.vad?.silence_duration_ms ?? 500,
      };
    }
    if (Object.keys(session).length) this.send({ type: 'session.update', session });
  }

  private send(obj: any) {
    if (!this.ws || !this.opened || this.ws.readyState !== this.ws.OPEN) return;
    this.ws.send(JSON.stringify(obj));
  }

  appendAudioBase64(b64pcm: string) {
    this.send({ type: 'input_audio_buffer.append', audio: b64pcm });
  }

  commitAudio() { this.send({ type: 'input_audio_buffer.commit' }); }

  requestResponse() { this.send({ type: 'response.create' }); }

  close() {
    this.ws?.close();
  }

  updateInstructions(instructions: string) {
    this.send({ type: 'session.update', session: { instructions } });
  }
}
