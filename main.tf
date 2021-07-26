provider "aws" {
  version = "~> 3.0"
  region  = "us-east-1"
}

resource "aws_sns_topic" "users-topic" {
  name         = "ep-poc-sls-service-users-topic"
  display_name = "registration"
  fifo_topic   = false
  policy       = <<EOT
  {
    "Version": "2008-10-17",
    "Id": "__default_policy_ID",
    "Statement": [
      {
        "Sid": "__default_statement_ID",
        "Effect": "Allow",
        "Principal": {
          "AWS": "*"
        },
        "Action": [
          "SNS:Publish",
          "SNS:RemovePermission",
          "SNS:SetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:Receive",
          "SNS:AddPermission",
          "SNS:Subscribe"
        ],
        "Resource": "arn:aws:sns:us-east-1:123456789012:ep-poc-sls-service-users-topic",
        "Condition": {
          "StringEquals": {
            "AWS:SourceOwner": "123456789012"
          }
        }
      },
      {
        "Sid": "__console_pub_0",
        "Effect": "Allow",
        "Principal": {
          "AWS": "*"
        },
        "Action": "SNS:Publish",
        "Resource": "arn:aws:sns:us-east-1:123456789012:ep-poc-sls-service-users-topic"
      },
      {
        "Sid": "__console_sub_0",
        "Effect": "Allow",
        "Principal": {
          "AWS": "*"
        },
        "Action": [
          "SNS:Subscribe",
          "SNS:Receive"
        ],
        "Resource": "arn:aws:sns:us-east-1:123456789012:ep-poc-sls-service-users-topic"
      }
    ]
  }
  EOT
}

resource "aws_sqs_queue" "users-queue" {
  name                      = "ep-poc-sls-service-users-queue"
  delay_seconds             = 0
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  depends_on = [
    aws_sns_topic.users-topic
  ]
  policy = <<EOT
{
  "Version": "2008-10-17",
  "Id": "__default_policy_ID",
  "Statement": [
    {
      "Sid": "__owner_statement",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "SQS:*",
      "Resource": "arn:aws:sqs:us-east-1:123456789012:ep-poc-sls-service-users-queue"
    },
    {
      "Sid": "topic-subscription-arn:aws:sns:us-east-1:123456789012:ep-poc-sls-service-users-topic",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "SQS:SendMessage",
      "Resource": "arn:aws:sqs:us-east-1:123456789012:ep-poc-sls-service-users-queue",
      "Condition": {
        "ArnLike": {
          "aws:SourceArn": "arn:aws:sns:us-east-1:123456789012:ep-poc-sls-service-users-topic"
        }
      }
    }
  ]
}
  EOT
}

resource "aws_sns_topic_subscription" "user_updates_sqs" {
  topic_arn = aws_sns_topic.users-topic.arn
  protocol  = "sqs"
  depends_on = [
    aws_sqs_queue.users-queue
  ]
  endpoint = aws_sqs_queue.users-queue.arn
}

resource "aws_sns_topic_subscription" "user_updates_email" {
  topic_arn = aws_sns_topic.users-topic.arn
  protocol  = "email"
  depends_on = [
    aws_sns_topic.users-topic
  ]
  endpoint = "email@example.com"
}

# resource "aws_db_instance" "poc-rds" {
#   allocated_storage     = 10
#   max_allocated_storage = 100
#   engine                = "mysql"
#   engine_version        = "5.7"
#   instance_class        = "db.t2.micro"
#   identifier            = "poc-rds"
#   name                  = "mysqlinstance"
#   username              = "admin"
#   password              = "A10203040"
#   skip_final_snapshot   = true
#   publicly_accessible   = true
# }
