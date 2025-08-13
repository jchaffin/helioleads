// B2B script engine tailored to selling HelioLeads to commercial solar installers

export type ScriptPhase =
  | "intro"
  | "identify"
  | "qualify"
  | "pain"
  | "value"
  | "demo"
  | "objection"
  | "schedule"
  | "close"
  | "done";

export interface ScriptState {
  phase: ScriptPhase;
  lastUtterance?: string;
  vars: {
    contactName?: string;
    company?: string;
    role?: string;
    volume?: string; // monthly lead or install volume
    tools?: string; // CRM/dialer/other
    pains?: string[];
    email?: string;
    timePref?: string; // e.g., Tue 2pm ET
  };
}

export interface ScriptTurn {
  reply: string;
  state: ScriptState;
  done?: boolean;
}

const RESPONSES: Record<ScriptPhase, (s: ScriptState) => string> = {
  intro: () =>
    "Hi, this is Helio from HelioLeads — we help commercial solar installers book more projects with AI-powered outreach. Do you have 30 seconds?",
  identify: (s) => {
    const name = s.vars.contactName ? `, ${s.vars.contactName}` : "";
    return `Great${name}. Are you the best person for sales/ops at ${s.vars.company ?? 'your company'}?`;
  },
  qualify: () =>
    "Quick check: how are you handling outbound today — any dialer or CRM, and roughly how many leads a month are you working?",
  pain: () =>
    "Got it. Where does it get painful — lead quality, speed-to-lead, show rates, or follow-up consistency?",
  value: () =>
    "HelioLeads finds installers, enriches contacts, and runs instant outbound with AI that talks like your best setter. Teams typically see faster first touches and a higher appointment rate.",
  demo: () =>
    "Would a 15‑minute demo this week help you see if it fits your workflow?",
  objection: () =>
    "Totally fair. Is it more timing, budget, or fit? If timing, I can send a quick one‑pager and book for next week.",
  schedule: (s) => {
    const askEmail = s.vars.email ? "" : " What’s the best email?";
    return `What day/time works for a 15‑minute demo?${askEmail}`.trim();
  },
  close: (s) =>
    `Perfect — I’ll send a calendar invite to ${s.vars.email ?? 'your email'} for ${s.vars.timePref ?? 'the chosen time'}. Anything you want us to focus on?`,
  done: () => "Thanks — talk soon!",
};

// Lightweight NLU helpers
function yesLike(t: string) {
  return /(yes|yeah|yep|sure|ok|okay|sounds good|let's|lets do|book|schedule)/i.test(t);
}
function noLike(t: string) {
  return /(no|not interested|pass|stop calling|remove me)/i.test(t);
}
function busyLike(t: string) {
  return /(busy|in a meeting|driving|can'?t talk|later|next week| another time)/i.test(t);
}
function priceLike(t: string) { return /(price|cost|budget|expensive)/i.test(t); }
function sendInfoLike(t: string) { return /(send info|email me|one pager|deck)/i.test(t); }
function notDM(t: string) { return /(not.*(decision|right) person|talk to|owner|partner|procurement|it handles|marketing handles)/i.test(t); }
function toolMention(t: string) { return /(salesforce|hubspot|pipedrive|go high level|gohighlevel|outreach|salesloft|twilio|aircall|kixie|phoneburner|five9|dialer|crm)/i.test(t); }

function extractEmail(t: string): string | undefined {
  const m = t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return m?.[0]?.toLowerCase();
}
function extractTimePref(t: string): string | undefined {
  const m = t.match(/(mon|tue|wed|thu|fri|sat|sun|today|tomorrow|next week).*?\b([0-9]{1,2})(:[0-5][0-9])?\s?(am|pm)?/i);
  return m?.[0];
}
function extractName(t: string): string | undefined {
  const m = t.match(/(this is|i'?m)\s+([A-Z][a-z'-]{1,})/i);
  return m?.[2];
}
function extractCompany(t: string): string | undefined {
  const m = t.match(/(from|at)\s+([A-Z][A-Za-z0-9 '&.-]{1,})/i);
  return m?.[2];
}

export function initialState(): ScriptState {
  return { phase: "intro", vars: { pains: [] } };
}

export function next(state: ScriptState, input: string): ScriptState {
  const text = (input || "").trim();
  const lower = text.toLowerCase();
  const vars = { ...state.vars };
  const name = extractName(text);
  if (name && !vars.contactName) vars.contactName = capitalize(name);
  const company = extractCompany(text);
  if (company && !vars.company) vars.company = company.trim();
  const email = extractEmail(text);
  if (email) vars.email = email;
  const timePref = extractTimePref(text);
  if (timePref) vars.timePref = timePref;
  if (toolMention(lower)) vars.tools = (vars.tools ? vars.tools + '; ' : '') + matchTool(lower);

  switch (state.phase) {
    case 'intro': {
      if (noLike(lower)) return { phase: 'done', vars, lastUtterance: text };
      if (busyLike(lower)) return { phase: 'demo', vars, lastUtterance: text }; // go to quick offer
      return { phase: 'identify', vars, lastUtterance: text };
    }
    case 'identify': {
      if (notDM(lower)) return { phase: 'schedule', vars, lastUtterance: text }; // ask for referral/email
      return { phase: 'qualify', vars, lastUtterance: text };
    }
    case 'qualify': {
      if (noLike(lower)) return { phase: 'done', vars, lastUtterance: text };
      return { phase: 'pain', vars, lastUtterance: text };
    }
    case 'pain': {
      // record simple pains
      const pains: string[] = vars.pains ? [...vars.pains] : [];
      if (/(lead quality|speed|speed to lead|show rate|no show|follow[- ]?up|data|contact)/i.test(lower)) {
        pains.push(text);
      }
      vars.pains = pains;
      return { phase: 'value', vars, lastUtterance: text };
    }
    case 'value': {
      if (yesLike(lower)) return { phase: 'schedule', vars, lastUtterance: text };
      if (sendInfoLike(lower) || busyLike(lower)) return { phase: 'schedule', vars, lastUtterance: text };
      if (priceLike(lower)) return { phase: 'objection', vars, lastUtterance: text };
      if (noLike(lower)) return { phase: 'done', vars, lastUtterance: text };
      return { phase: 'demo', vars, lastUtterance: text };
    }
    case 'demo': {
      if (yesLike(lower)) return { phase: 'schedule', vars, lastUtterance: text };
      if (noLike(lower)) return { phase: 'done', vars, lastUtterance: text };
      if (priceLike(lower) || sendInfoLike(lower) || busyLike(lower)) return { phase: 'objection', vars, lastUtterance: text };
      return { phase: 'schedule', vars, lastUtterance: text };
    }
    case 'objection': {
      if (priceLike(lower)) return { phase: 'value', vars, lastUtterance: text };
      if (sendInfoLike(lower)) return { phase: 'schedule', vars, lastUtterance: text };
      if (busyLike(lower)) return { phase: 'schedule', vars, lastUtterance: text };
      if (noLike(lower)) return { phase: 'done', vars, lastUtterance: text };
      return { phase: 'schedule', vars, lastUtterance: text };
    }
    case 'schedule': {
      if (vars.email && vars.timePref) return { phase: 'close', vars, lastUtterance: text };
      return { phase: 'schedule', vars, lastUtterance: text };
    }
    case 'close':
      return { phase: 'done', vars, lastUtterance: text };
    case 'done':
    default:
      return { ...state, vars, lastUtterance: text };
  }
}

export function turn(state: ScriptState, input: string): ScriptTurn {
  const newState = next(state, input);
  const reply = RESPONSES[newState.phase](newState);
  return { reply, state: newState, done: newState.phase === 'done' };
}

function matchTool(t: string): string {
  const m = t.match(/salesforce|hubspot|pipedrive|go high level|gohighlevel|outreach|salesloft|twilio|aircall|kixie|phoneburner|five9|dialer|crm/i);
  return m ? m[0] : 'tool';
}
function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s; }

// Build concise Realtime instructions to let the model infer intent and details
export function buildRealtimeInstructions(state?: Partial<ScriptState>): string {
  const vars = state?.vars || {} as ScriptState['vars'];
  const who = `You are a concise, consultative SDR selling HelioLeads to commercial solar installers.`;
  const goal = `Primary goal: book a 15-minute demo. Secondary: capture decision maker name, role, company, pains, tools, email, time preference.`;
  const style = `Style: confident, friendly, B2B, short sentences, ask one question at a time.`;
  const guard = `Never pitch residential solar. Speak as a platform vendor helping installers win more projects.`;
  const phases = `Flow: intro -> identify (are they the right person) -> qualify (tools + monthly volume) -> pain -> value -> demo -> objections -> schedule -> close.`;
  const objections = `Handle objections: if price/budget, emphasize ROI and quick pilot; if timing/busy, offer one-pager + schedule next week; if not the right person, ask for referral and email.`;
  const capture = `When they provide email or time, acknowledge and move forward. Confirm day/time and email succinctly.`;
  const memory = `Known so far: ${
    [
      vars.contactName ? `name=${vars.contactName}` : undefined,
      vars.company ? `company=${vars.company}` : undefined,
      vars.role ? `role=${vars.role}` : undefined,
      vars.tools ? `tools=${vars.tools}` : undefined,
      vars.volume ? `volume=${vars.volume}` : undefined,
    ].filter(Boolean).join(', ') || 'none'
  }.`;
  const closing = `Always end the turn with a clear, short question that advances to scheduling.`;
  return [who, goal, style, guard, phases, objections, capture, memory, closing].join('\n');
}
