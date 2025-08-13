resource "aws_secretsmanager_secret" "app" {
  name        = "${local.name_prefix}-app-secrets"
  description = "HelioLeads application secrets"
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id     = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    OPENAI_API_KEY       = var.openai_api_key,
    TWILIO_ACCOUNT_SID   = var.twilio_account_sid,
    TWILIO_AUTH_TOKEN    = var.twilio_auth_token,
    ELEVENLABS_API_KEY   = var.elevenlabs_api_key,
  })
}

output "secret_arn" {
  value = aws_secretsmanager_secret.app.arn
}

