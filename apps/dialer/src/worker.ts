// apps/dialer/src/worker.ts
import { Eleven } from "./elevenLabs";
import { createRealtimeAgent } from "./openaiRealtime";

const tts = new Eleven();
const agent = createRealtimeAgent();

export async function synthesizeReply(text: string) {
  // get TTS stream for live piping to the call
  return tts.toStream(text);
}

export async function getAgentReply(userText: string) {
  const session = agent.session();
  const { output } = await session.respond({ input: userText });
  return output?.text ?? "";
}