import client from 'prom-client';

// Default metrics (process, GC, etc.)
client.collectDefaultMetrics();

export const metrics = {
  wsConnectionsOpened: new client.Counter({ name: 'dialer_ws_connections_opened_total', help: 'WS connections opened' }),
  wsConnectionsClosed: new client.Counter({ name: 'dialer_ws_connections_closed_total', help: 'WS connections closed' }),
  wsMediaFramesIn: new client.Counter({ name: 'dialer_ws_media_frames_in_total', help: 'Inbound media frames' }),
  ttsFramesOut: new client.Counter({ name: 'dialer_tts_frames_out_total', help: 'Outbound TTS frames' }),
  wsSendAttempts: new client.Counter({ name: 'dialer_ws_send_attempts_total', help: 'WS send attempts', labelNames: ['result'] }),
};

export const register = client.register;

