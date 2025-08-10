// apps/dialer/src/schedule/when.ts
import { DateTime } from "luxon";
import { QUIET_HOURS, WEEKDAYS, HOLIDAYS_US_2025 } from "./config";

export function resolveTZ(lead:{tz_override?:string, zip?:string, state?:string, phone?:string}) {
  if (lead.tz_override) return lead.tz_override;                 // e.g., "America/New_York"
  if (lead.zip) return zipToTZ(lead.zip);                         // your table
  if (lead.state) return stateToTZ(lead.state);                   // crude: FL->America/New_York or Pensacola zips
  return areaCodeToTZ(lead.phone);                                // fallback
}

export function nextLegalTime(lead:any, nowUTC=DateTime.utc()) {
  const tz = resolveTZ(lead) || "America/New_York";
  const local = nowUTC.setZone(tz);
  const rule = QUIET_HOURS[(lead.state as keyof typeof QUIET_HOURS) || "default"] || QUIET_HOURS.default;

  let t = local;
  // bump to weekday, skip holidays
  while (!WEEKDAYS.includes(t.weekday) || HOLIDAYS_US_2025.includes(t.toISODate()!)) {
    t = t.plus({ days: 1 }).startOf("day");
  }
  // inside window?
  if (t.hour < rule.start) t = t.set({ hour: rule.start, minute: 0, second: 0, millisecond: 0 });
  else if (t.hour >= rule.end) {
    t = t.plus({ days: 1 }).set({ hour: rule.start, minute: 0, second: 0, millisecond: 0 });
    while (!WEEKDAYS.includes(t.weekday) || HOLIDAYS_US_2025.includes(t.toISODate()!)) {
      t = t.plus({ days: 1 }).startOf("day").set({ hour: rule.start });
    }
  }
  return t.toUTC();
}