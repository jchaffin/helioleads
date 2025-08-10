// apps/dialer/src/schedule/guard.ts
import { DateTime } from "luxon";
import { nextLegalTime, resolveTZ } from "./when";
import { QUIET_HOURS } from "./config";

export function withinWindow(lead:any): boolean {
  const tz = resolveTZ(lead) || "America/New_York";
  const t = DateTime.utc().setZone(tz);
  const r = QUIET_HOURS[(lead.state as any) || "default"] || QUIET_HOURS.default;
  return t.hour >= r.start && t.hour < r.end;
}