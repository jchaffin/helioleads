resource "aws_security_group" "redis_sg" {
  name        = "${local.name_prefix}-redis-sg"
  description = "Allow Redis"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.cidr_allow]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.name_prefix}-redis-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.project_name}-redis"
  description                   = "Redis for HelioLeads"
  engine                        = "redis"
  engine_version                = "7.0"
  node_type                     = var.redis_node_type
  number_cache_clusters         = 1
  automatic_failover_enabled    = false
  multi_az_enabled              = false
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = [aws_security_group.redis_sg.id]
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = false
  apply_immediately             = true
}

output "redis_primary_endpoint" {
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

