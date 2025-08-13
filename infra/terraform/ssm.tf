locals {
  ssm_prefix = "/${var.project_name}/${var.env}"
}

resource "aws_ssm_parameter" "openai_key" {
  name  = "${local.ssm_prefix}/OPENAI_API_KEY"
  type  = "SecureString"
  value = coalesce(var.openai_api_key, "")
}

resource "aws_ssm_parameter" "twilio_sid" {
  name  = "${local.ssm_prefix}/TWILIO_ACCOUNT_SID"
  type  = "SecureString"
  value = coalesce(var.twilio_account_sid, "")
}

resource "aws_ssm_parameter" "twilio_token" {
  name  = "${local.ssm_prefix}/TWILIO_AUTH_TOKEN"
  type  = "SecureString"
  value = coalesce(var.twilio_auth_token, "")
}

resource "aws_ssm_parameter" "eleven_key" {
  name  = "${local.ssm_prefix}/ELEVENLABS_API_KEY"
  type  = "SecureString"
  value = coalesce(var.elevenlabs_api_key, "")
}

resource "aws_ssm_parameter" "pg_host" {
  name  = "${local.ssm_prefix}/PG_HOST"
  type  = "String"
  value = aws_db_instance.postgres.address
}

resource "aws_ssm_parameter" "pg_port" {
  name  = "${local.ssm_prefix}/PG_PORT"
  type  = "String"
  value = aws_db_instance.postgres.port
}

resource "aws_ssm_parameter" "pg_user" {
  name  = "${local.ssm_prefix}/PG_USER"
  type  = "SecureString"
  value = var.db_username
}

resource "aws_ssm_parameter" "pg_password" {
  name  = "${local.ssm_prefix}/PG_PASSWORD"
  type  = "SecureString"
  value = var.db_password
}

resource "aws_ssm_parameter" "pg_database" {
  name  = "${local.ssm_prefix}/PG_DATABASE"
  type  = "String"
  value = var.project_name
}

resource "aws_ssm_parameter" "redis_host" {
  name  = "${local.ssm_prefix}/REDIS_HOST"
  type  = "String"
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

resource "aws_ssm_parameter" "redis_port" {
  name  = "${local.ssm_prefix}/REDIS_PORT"
  type  = "String"
  value = "6379"
}

resource "aws_ssm_parameter" "database_url" {
  name  = "${local.ssm_prefix}/DATABASE_URL"
  type  = "SecureString"
  value = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.project_name}"
}

resource "aws_ssm_parameter" "redis_url" {
  name  = "${local.ssm_prefix}/REDIS_URL"
  type  = "String"
  value = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:6379"
}

output "ssm_prefix" { value = local.ssm_prefix }
output "ssm_params" {
  value = {
    OPENAI_API_KEY = aws_ssm_parameter.openai_key.name
    TWILIO_ACCOUNT_SID = aws_ssm_parameter.twilio_sid.name
    TWILIO_AUTH_TOKEN = aws_ssm_parameter.twilio_token.name
    ELEVENLABS_API_KEY = aws_ssm_parameter.eleven_key.name
    PG_HOST = aws_ssm_parameter.pg_host.name
    PG_PORT = aws_ssm_parameter.pg_port.name
    PG_USER = aws_ssm_parameter.pg_user.name
    PG_PASSWORD = aws_ssm_parameter.pg_password.name
    PG_DATABASE = aws_ssm_parameter.pg_database.name
    REDIS_HOST = aws_ssm_parameter.redis_host.name
    REDIS_PORT = aws_ssm_parameter.redis_port.name
    DATABASE_URL = aws_ssm_parameter.database_url.name
    REDIS_URL = aws_ssm_parameter.redis_url.name
  }
}

