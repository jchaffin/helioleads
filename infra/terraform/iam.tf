data "aws_kms_alias" "ssm" {
  name = "alias/aws/ssm"
}

data "aws_kms_alias" "secretsmanager" {
  name = "alias/aws/secretsmanager"
}

locals {
  ssm_param_arn_prefix = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter${local.ssm_prefix}/*"
  ssm_via_service      = "ssm.${data.aws_region.current.name}.amazonaws.com"
  sec_via_service      = "secretsmanager.${data.aws_region.current.name}.amazonaws.com"
}

data "aws_iam_policy_document" "app_runtime" {
  statement {
    sid    = "ReadSSMParams"
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath",
      "ssm:DescribeParameters",
    ]
    resources = [local.ssm_param_arn_prefix]
  }

  statement {
    sid    = "DecryptSSMParams"
    effect = "Allow"
    actions = ["kms:Decrypt"]
    resources = [data.aws_kms_alias.ssm.target_key_arn]
    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = [local.ssm_via_service]
    }
  }

  statement {
    sid    = "ReadSecretsManager"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [aws_secretsmanager_secret.app.arn]
  }

  statement {
    sid    = "DecryptSecretsManager"
    effect = "Allow"
    actions = ["kms:Decrypt"]
    resources = [data.aws_kms_alias.secretsmanager.target_key_arn]
    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = [local.sec_via_service]
    }
  }
}

output "app_runtime_policy_json" {
  description = "Attach this policy to the IAM role used by the app to read SSM/Secrets"
  value       = data.aws_iam_policy_document.app_runtime.json
}

