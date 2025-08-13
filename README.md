# HelioLeads

**HelioLeads** is an agentic AI-powered outbound calling system for market research and lead generation.  
It scrapes target businesses, enriches contact data, and schedules calls within legal time windows.  
A real-time voice pipeline (Twilio + OpenAI Realtime + ElevenLabs) handles the conversation, logs outcomes,  
and feeds them into a dashboard for conversion analytics and market fit insights.

## Features
- Lead scraping and enrichment
- Timezone-aware call scheduling
- Real-time AI voice agents
- Automatic call logging and research storage
- Next.js dashboard for insights and KPIs

## Packages
- `apps/dialer` – Outbound calling service and scheduler
- `apps/dashboard` – Web dashboard for lead and call analytics
- `shared/` – Common types, utilities, and constants

## Requirements
- Node.js 20+
- PostgreSQL
- Twilio account with a purchased number
- OpenAI API key
- ElevenLabs API key
 - Redis (for BullMQ queues)

## Real-time Voice (Twilio Streaming)

The dashboard exposes Twilio webhooks under `/api/voice` (TwiML) and `/api/voice-status` (status callbacks).
The TwiML instructs Twilio to open a bidirectional `<Stream>` to the Dialer’s WebSocket endpoint
(`DIALER_WS_URL`, default `ws://localhost:4000/ws`). The Dialer bridges audio with OpenAI Realtime + TTS.

Configure these env vars in `.env`:

- `DIALER_WS_URL` – your dialer WS endpoint for Twilio `<Stream>`
Point your Twilio Voice webhook for your phone number to:

- Voice URL: `https://<your-dashboard-host>/api/voice`
- Status callback URL: `https://<your-dashboard-host>/api/voice-status`
## Redis + Jobs

The dialer uses Redis via BullMQ for scheduling and processing outbound calls.

- Configure `.env`:
  - `REDIS_HOST` (default `127.0.0.1`)
  - `REDIS_PORT` (default `6379`)
  - `REDIS_PASSWORD` (optional)
  - `REDIS_TLS` (set to `true` if using TLS)

- Enqueue jobs in code using `enqueueDial` (see `apps/dialer/src/queue.ts`).

- Run a worker locally:
  - `npm run --workspace @helio/dialer worker`
  - Logs appear for job lifecycle events.

- The scheduler helper (`apps/dialer/src/schedule/enqueue.ts`) adds jobs with a delay until the next legal call time.
