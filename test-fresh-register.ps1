$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$body = @{
    name = "Fresh Test User"
    email = "fresh.user.$timestamp@example.com"
    password = "FreshTest@123"
    phone = "01234567890"
    role = "buyer"
} | ConvertTo-Json

Write-Host "Testing registration with email: fresh.user.$timestamp@example.com" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "`n✅ SUCCESS - Registration worked!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`n❌ FAILED - Registration failed!" -ForegroundColor Red
    Write-Host "`nError:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nServer Response:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}
