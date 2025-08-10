// apps/dialer/src/schedule/config.ts
export const QUIET_HOURS = {
  default: { start: 8, end: 21 },     // 8–21
  FL:      { start: 8, end: 20 },     // 8–20
  // add stricter states here as needed
};
export const WEEKDAYS = [1,2,3,4,5];   // Mon–Fri only for B2B
export const HOLIDAYS_US_2025 = ["2025-09-01","2025-11-27","2025-12-25"]; // extend