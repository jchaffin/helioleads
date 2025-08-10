export type CallEvent =
  | { type: "call_started"; callSid: string; to: string }
  | { type: "call_ended"; callSid: string; durationSec: number }
  | { type: "transcript"; callSid: string; text: string };

export async function logEvent(_event: CallEvent): Promise<void> {
  // TODO: Write to CSV and/or Postgres
  console.log("[logger] event", _event);
}
