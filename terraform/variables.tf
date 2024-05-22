variable "key-name" {
  default = "deployer-key"
}

variable "network-security-group-name" {
  default = "nsg-inbound"
}

variable "ubuntu-ami" {
  default = "ami-00c71bd4d220aa22a"
}

variable "ubuntu-instance-type" {
  default = "t2.micro"
}
