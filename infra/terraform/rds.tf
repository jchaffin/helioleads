resource "aws_security_group" "rds_sg" {
  name        = "${local.name_prefix}-rds-sg"
  description = "Allow Postgres"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
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

resource "aws_db_subnet_group" "rds" {
  name       = "${local.name_prefix}-rds-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_db_instance" "postgres" {
  identifier                 = "${var.project_name}-pg"
  engine                     = "postgres"
  engine_version             = "15"
  instance_class             = var.db_instance_class
  allocated_storage          = var.db_allocated_storage
  db_name                    = var.project_name
  username                   = var.db_username
  password                   = var.db_password
  db_subnet_group_name       = aws_db_subnet_group.rds.name
  vpc_security_group_ids     = [aws_security_group.rds_sg.id]
  skip_final_snapshot        = true
  apply_immediately          = true
  publicly_accessible        = var.db_publicly_accessible
  multi_az                   = var.db_multi_az
  deletion_protection        = false
  auto_minor_version_upgrade = true
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "rds_port" {
  value = aws_db_instance.postgres.port
}

