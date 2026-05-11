$response = Invoke-WebRequest -Uri "http://localhost:5000/api/properties?page=1&limit=1" -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Full Response Structure:" -ForegroundColor Cyan
$json | ConvertTo-Json -Depth 5
