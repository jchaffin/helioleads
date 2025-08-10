export interface Lead {
  id: string;
  name: string;
  phone: string;
  company?: string;
  city?: string;
  meta?: Record<string, string>;
}

export interface Installer {
  id: string;
  name: string;
  phone: string;
  serviceArea?: string[];
}

export interface TranscriptSegment {
  atMs: number;
  speaker: "agent" | "prospect";
  text: string;
}
