terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region     = "eu-west-3"
  access_key = ""
  secret_key = ""
}

resource "aws_key_pair" "deployer" {
  key_name   = var.key-name
  public_key = file("${path.module}/my-key.pub")
}

resource "aws_security_group" "network-security-group" {
  name        = var.network-security-group-name
  description = "Allow TLS inbound traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }


  tags = {
    Name = "nsg-inbound"
  }
}

resource "aws_instance" "test" {
  ami                    = "ami-00c71bd4d220aa22a"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.network-security-group.id]
  key_name               = var.key-name

  tags = {
    Name = "terraform-test"
  }

}

resource "aws_db_instance" "monpostgres" {
  allocated_storage   = 20
  db_name             = "terraformdb"
  engine              = "postgres"
  engine_version      = "16.2"
  option_group_name   = "default:postgres-16"
  instance_class      = "db.t3.micro"
  username            = "postgres"
  password            = "foobarbaz"
  publicly_accessible = true
  skip_final_snapshot = true

}
