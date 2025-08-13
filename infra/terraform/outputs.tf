output "database_url" {
  value     = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.project_name}"
  sensitive = true
}

output "redis_url" {
  value = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:6379"
}

