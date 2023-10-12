output "endpoint" {
  value = scaleway_object_bucket.tfstate_bucket.endpoint
}

output "region" {
  value = scaleway_object_bucket.tfstate_bucket.region
}

output "bucket" {
  value = scaleway_object_bucket.tfstate_bucket.name
}
