import 'dotenv/config';
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { registerCallStreamRoute } from './callStream';
import { register, metrics as m } from './metrics';

const DEFAULT_PORT = Number(process.env.PORT || 4000);

export async function startServer(port: number = DEFAULT_PORT) {
  const app = Fastify({ logger: true, requestTimeout: 0 });

  await app.register(websocket, {
    options: { maxPayload: 1_000_000, perMessageDeflate: false },
  });

  app.get('/health', async () => ({ ok: true }));
  app.get('/ready', async () => ({ ready: true }));
  app.get('/metrics', async (req, reply) => {
    try {
      const body = await register.metrics();
      reply.header('Content-Type', register.contentType);
      reply.send(body);
    } catch (err) {
      reply.status(500).send('metrics_error');
    }
  });

  registerCallStreamRoute(app);

  const shutdown = async (code = 0) => {
    try { await app.close(); } catch {}
    process.exit(code);
  };
  process.on('SIGTERM', () => shutdown(0));
  process.on('SIGINT', () => shutdown(0));

  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`[dialer] HTTP + WS server listening on :${port}`);

    // Log OpenAI Realtime configuration for visibility
    const realtimeModel = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview';
    const realtimeSampleRate = Number(process.env.OPENAI_REALTIME_SAMPLE_RATE || 16000);
    const useVadRaw = (process.env.OPENAI_REALTIME_USE_SERVER_VAD ?? 'true').toString().toLowerCase();
    const useVad = useVadRaw === '1' || useVadRaw === 'true' || useVadRaw === 'yes' || useVadRaw === 'y';
    const vadThreshold = Number(process.env.OPENAI_REALTIME_VAD_THRESHOLD ?? 0.5);
    const vadPrefixMs = Number(process.env.OPENAI_REALTIME_VAD_PREFIX_MS ?? 300);
    const vadSilenceMs = Number(process.env.OPENAI_REALTIME_VAD_SILENCE_MS ?? 500);

    app.log.info(
      {
        realtime: {
          model: realtimeModel,
          sampleRate: realtimeSampleRate,
          serverVAD: useVad,
          vad: { threshold: vadThreshold, prefixMs: vadPrefixMs, silenceMs: vadSilenceMs },
        },
      },
      '[dialer] OpenAI Realtime configuration'
    );
  } catch (err) {
    app.log.error(err);
    await shutdown(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
