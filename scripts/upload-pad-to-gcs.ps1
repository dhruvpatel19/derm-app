param(
  [Parameter(Mandatory = $true)]
  [string]$BucketUri,

  [string]$SourceDir = "data/datasets/pad-ufes-20/images"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SourceDir)) {
  throw "Source directory not found: $SourceDir"
}

$gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloud) {
  throw "gcloud CLI not found. Install Google Cloud SDK first."
}

$normalizedBucketUri = $BucketUri.TrimEnd("/")

Write-Host "Syncing PAD dataset to $normalizedBucketUri ..." -ForegroundColor Cyan
& gcloud storage rsync --recursive $SourceDir $normalizedBucketUri

if ($LASTEXITCODE -ne 0) {
  throw "Upload failed."
}

$publicBaseUrl = $normalizedBucketUri -replace "^gs://", "https://storage.googleapis.com/"

Write-Host ""
Write-Host "Upload complete." -ForegroundColor Green
Write-Host "Set this env var in Vercel:" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_PAD_DATASET_BASE_URL=$publicBaseUrl" -ForegroundColor White
Write-Host ""
Write-Host "Current resolver behavior:" -ForegroundColor Yellow
Write-Host "  data/datasets/pad-ufes-20/images/imgs_part_1/imgs_part_1/PAT_330_695_296.png" -ForegroundColor White
Write-Host "  -> $publicBaseUrl/imgs_part_1/imgs_part_1/PAT_330_695_296.png" -ForegroundColor White
Write-Host ""
Write-Host "Expected example:" -ForegroundColor Yellow
Write-Host "  $publicBaseUrl/imgs_part_1/imgs_part_1/PAT_100_393_595.png" -ForegroundColor White
