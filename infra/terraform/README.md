HelioLeads AWS Infra (Terraform)

What this provisions
- AWS Secrets Manager: stores OPENAI, Twilio, ElevenLabs keys
- Amazon RDS (PostgreSQL): logging database
- Amazon ElastiCache (Redis): queue backend
- AWS SSM Parameter Store: optional alternative to Secrets Manager and for computed connection strings
- IAM policy document output for runtime access (attach to ECS/Lambda/EC2 role)

Assumptions
- Uses the default VPC and its subnets in the chosen region
- Creates security groups that allow access from `var.cidr_allow` (default is your IP or 0.0.0.0/0 for quickstart)

Quick start
1) Ensure Terraform and AWS credentials (AWS_PROFILE / AWS_ACCESS_KEY_ID etc.) are configured
2) Copy tfvars example and edit values:
   cp terraform.tfvars.example terraform.tfvars
3) Init and apply:
   terraform init
   terraform apply

Generate .env lines from outputs
- One-liner:
  terraform output -raw database_url
  terraform output -raw redis_url

- Or run the helper script to emit all lines:
  ./gen-env.sh > ../../.env.generated
  # then review and merge into your .env

Important variables
- region: AWS region (e.g., us-east-1)
- project_name: name prefix for resources
- db_username, db_password: credentials for PostgreSQL
- cidr_allow: CIDR allowed to access Postgres/Redis security groups

Outputs
- secret_arn: Secrets Manager ARN
- rds_endpoint: Postgres endpoint
- redis_primary_endpoint: Redis primary endpoint
- database_url: Postgres connection string (sensitive)
- redis_url: Redis connection string
- ssm_prefix: SSM path prefix used
- ssm_params: Map of created SSM parameter names
- app_runtime_policy_json: Minimal policy JSON to read SSM/Secrets

Attaching IAM policy
- Create an IAM policy in AWS with the `app_runtime_policy_json` output
- Attach that policy to the compute role used by your app (e.g., ECS task role / Lambda execution role)
