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