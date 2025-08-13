variable "region" { type = string default = "us-east-1" }
variable "project_name" { type = string default = "helioleads" }
variable "env" { type = string default = "dev" }

variable "cidr_allow" {
  type        = string
  description = "CIDR allowed to access DB/Redis"
  # For quickstart, override with your IP (e.g. 1.2.3.4/32)
  default     = "0.0.0.0/0"
}

variable "db_username" { type = string default = "solarbot" }
variable "db_password" { type = string default = "changeme" sensitive = true }
variable "db_instance_class" { type = string default = "db.t4g.micro" }
variable "db_allocated_storage" { type = number default = 20 }
variable "db_multi_az" { type = bool default = false }
variable "db_publicly_accessible" { type = bool default = true }

variable "redis_node_type" { type = string default = "cache.t4g.micro" }

variable "openai_api_key" { type = string default = "" sensitive = true }
variable "twilio_account_sid" { type = string default = "" sensitive = true }
variable "twilio_auth_token" { type = string default = "" sensitive = true }
variable "elevenlabs_api_key" { type = string default = "" sensitive = true }
