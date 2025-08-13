// Basic audio helpers for Twilio <Stream> integration
// - Twilio inbound: 8kHz mono mu-law (G.711) frames in base64
// - OpenAI Realtime input: 16-bit PCM, typically 16kHz or 24kHz

// Lookup table for mu-law to PCM16 conversion
const MULAW_TO_PCM16 = new Int16Array(256);
for (let i = 0; i < 256; i++) {
  let u = ~i & 0xff;
  let sign = (u & 0x80) ? -1 : 1;
  let exponent = (u >> 4) & 0x07;
  let mantissa = u & 0x0f;
  let magnitude = ((mantissa << 4) + 8) << (exponent + 3);
  MULAW_TO_PCM16[i] = sign * magnitude;
}

export function muLawToPCM16(mu: Uint8Array): Int16Array {
  const out = new Int16Array(mu.length);
  for (let i = 0; i < mu.length; i++) out[i] = MULAW_TO_PCM16[mu[i]];
  return out;
}

export function resamplePCM16Mono(input: Int16Array, inRate: number, outRate: number): Int16Array {
  if (inRate === outRate) return input;
  const ratio = outRate / inRate;
  const outLength = Math.floor(input.length * ratio);
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = i / ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const t = srcIndex - i0;
    const s0 = input[i0];
    const s1 = input[i1];
    out[i] = (s0 + (s1 - s0) * t) | 0;
  }
  return out;
}

export function pcm16ToBase64(pcm: Int16Array): string {
  const buf = Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  return buf.toString('base64');
}

