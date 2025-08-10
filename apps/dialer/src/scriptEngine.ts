export type ScriptPhase = "intro" | "qualify" | "pitch" | "close" | "done";

export interface ScriptState {
  phase: ScriptPhase;
  lastUtterance?: string;
  vars: Record<string, string>;
}

export function initialState(): ScriptState {
  return { phase: "intro", vars: {} };
}

export function next(state: ScriptState, input: string): ScriptState {
  // TODO: replace with real state machine
  const trimmed = input.trim().toLowerCase();
  if (state.phase === "intro") {
    return { ...state, phase: "qualify", lastUtterance: trimmed };
  }
  if (state.phase === "qualify") {
    return { ...state, phase: "pitch", lastUtterance: trimmed };
  }
  if (state.phase === "pitch") {
    return { ...state, phase: "close", lastUtterance: trimmed };
  }
  if (state.phase === "close") {
    return { ...state, phase: "done", lastUtterance: trimmed };
  }
  return state;
}
