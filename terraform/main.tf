provider "apigee" {
  org          = var.apigee_organization
  access_token = var.apigee_token
}

terraform {
  backend "azurerm" {}

  required_providers {
    apigee = "~> 0.0"
    archive = "~> 1.3"
  }
}

module "dps_api" {
  source             = "github.com/NHSDigital/api-platform-service-module"
  name               = "dps-submission-api"
  path               = "dps-submission-api"
  apigee_environment = var.apigee_environment
  proxy_type         = "live"
  namespace          = var.namespace
  make_api_product         = false
  api_product_display_name = "DPS Submission API"
  api_product_description  = ""
}



resource "apigee_target_server" "dps-api" {
    count   = length(regexall("sandbox", var.apigee_environment)) > 0 ? 0 : 1
    name    = "dps-submission-api"
    host    = var.dps-submission-api-host
    env     = var.apigee_environment
    enabled = true
    port    = 443

    ssl_info {
      ssl_enabled              = true
      client_auth_enabled      = false
      ignore_validation_errors = false
      ciphers                  = []
      protocols                = []
    }
}
