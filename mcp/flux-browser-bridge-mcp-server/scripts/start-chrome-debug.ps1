# Start Chrome for Flux Browser Bridge (GHL automation)
# Run in PowerShell BEFORE asking Cursor to control the browser.

$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$UserData = "$env:LOCALAPPDATA\Google\Chrome\User Data"

if (-not (Test-Path $Chrome)) {
  Write-Error "Chrome not found at $Chrome"
  exit 1
}

Write-Host "Closing existing Chrome processes..."
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Starting Chrome with remote debugging on port 9222..."
Start-Process $Chrome -ArgumentList @(
  "--remote-debugging-port=9222",
  "--user-data-dir=`"$UserData`""
)

Start-Sleep -Seconds 3
try {
  $version = Invoke-RestMethod "http://127.0.0.1:9222/json/version"
  Write-Host "CDP ready:" $version.Browser
} catch {
  Write-Warning "CDP not responding yet. Wait a few seconds and retry."
}
