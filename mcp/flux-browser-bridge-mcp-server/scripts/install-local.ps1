# One-shot install for Jonathan's local flux-web
# Run in PowerShell (Desktop)

$ErrorActionPreference = "Stop"
$RepoRoot = "C:\Users\jonat\OneDrive\Desktop\flux-web"
$McpRoot = Join-Path $RepoRoot "mcp\flux-browser-bridge-mcp-server"
$Branch = "cursor/war-room-sms-ghl-workflow-a1d1"

Write-Host "=== Flux Browser Bridge — Local Install ===" -ForegroundColor Cyan
Write-Host "Repo: $RepoRoot"

if (-not (Test-Path $RepoRoot)) {
  Write-Error "Repo not found at $RepoRoot. Clone first: git clone https://github.com/fluxopss/flux-web.git `"$RepoRoot`""
}

Set-Location $RepoRoot

Write-Host "`n[1/4] Syncing git branch $Branch..."
git fetch origin
git checkout $Branch 2>$null
if ($LASTEXITCODE -ne 0) {
  git checkout -b $Branch "origin/$Branch"
}
git pull origin $Branch

Write-Host "`n[2/4] Checking Node.js..."
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
  Write-Error "Node.js not found. Install Node 20+ from https://nodejs.org"
}
Write-Host "Node: $nodeVersion"

Write-Host "`n[3/4] Installing MCP dependencies..."
Set-Location $McpRoot
npm install

Write-Host "`n[4/4] Building TypeScript..."
npm run build

if (-not (Test-Path (Join-Path $McpRoot "dist\index.js"))) {
  Write-Error "Build failed — dist\index.js not found"
}

Write-Host "`n=== Install complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Add flux-browser-bridge to %USERPROFILE%\.cursor\mcp.json"
Write-Host "     (see cursor-mcp.example.json in this folder)"
Write-Host "  2. Restart Cursor"
Write-Host "  3. Run: .\scripts\start-chrome-debug.ps1"
Write-Host "  4. In Cursor chat: flux_browser_connect mode=cdp start_url=https://app.gohighlevel.com"
Write-Host ""
