#!/usr/bin/env bash
set -euo pipefail

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform not found in PATH" >&2
  exit 1
fi

# Emits .env-style lines using terraform outputs

pg_url=$(terraform output -raw database_url 2>/dev/null || true)
redis_url=$(terraform output -raw redis_url 2>/dev/null || true)
rds_endpoint=$(terraform output -raw rds_endpoint 2>/dev/null || true)
rds_port=$(terraform output -raw rds_port 2>/dev/null || true)
redis_host=$(terraform output -raw redis_primary_endpoint 2>/dev/null || true)

echo "# Generated from Terraform outputs"
if [[ -n "$pg_url" ]]; then echo "DATABASE_URL=$pg_url"; fi
if [[ -n "$redis_url" ]]; then echo "REDIS_URL=$redis_url"; fi
if [[ -n "$rds_endpoint" ]]; then echo "PG_HOST=$rds_endpoint"; fi
if [[ -n "$rds_port" ]]; then echo "PG_PORT=$rds_port"; fi
if [[ -n "$redis_host" ]]; then echo "REDIS_HOST=$redis_host"; fi

echo "# Fill these if not using Secrets Manager/SSM"
echo "TWILIO_ACCOUNT_SID="
echo "TWILIO_AUTH_TOKEN="
echo "OPENAI_API_KEY="
echo "ELEVENLABS_API_KEY="

