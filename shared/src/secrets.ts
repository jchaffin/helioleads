// shared/src/secrets.ts

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";

type LoadOpts = {
  secretId?: string;      // e.g. "helioleads/secrets"
  region?: string;        // e.g. "us-east-1"
  required?: string[];    // keys that must exist
};

export async function loadSecrets(opts: LoadOpts = {}) {
  // Prefer AWS. Fallback to .env
  const secretId = opts.secretId || process.env.AWS_SECRET_ID;
  const region = opts.region || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

  if (secretId && region) {
    const client = new SecretsManagerClient({ region });
    try {
      const out = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
      if (out.SecretString) {
        const kv = JSON.parse(out.SecretString);
        for (const [k, v] of Object.entries(kv)) if (process.env[k] == null) process.env[k] = String(v);
      }
    } catch (e) {
      // Fall back silently
    }
  }

  // .env fallback
  dotenv.config();

  // enforce required keys if provided
  if (opts.required?.length) {
    const missing = opts.required.filter((k) => !process.env[k]);
    if (missing.length) throw new Error(`Missing required env: ${missing.join(", ")}`);
  }
}