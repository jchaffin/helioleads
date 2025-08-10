import 'dotenv/config';
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { registerCallStreamRoute } from './callStream';
import { loadSecrets } from '@helioleads/shared';

const DEFAULT_PORT = Number(process.env.PORT || 4000);

export async function startServer(port: number = DEFAULT_PORT) {
  await loadSecrets({
    secretId: process.env.AWS_SECRET_ID,
    region: process.env.AWS_REGION,
    required: ['TWILIO_ACCOUNT_SID','TWILIO_AUTH_TOKEN','OPENAI_API_KEY','ELEVENLABS_API_KEY']
  });

  const app = Fastify({ logger: true, requestTimeout: 0 });

  await app.register(websocket, {
    options: { maxPayload: 1_000_000, perMessageDeflate: false },
  });

  app.get('/health', async () => ({ ok: true }));
  app.get('/ready', async () => ({ ready: true }));

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
  } catch (err) {
    app.log.error(err);
    await shutdown(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}