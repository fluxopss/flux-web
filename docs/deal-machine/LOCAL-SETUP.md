# Flux Web — Local Desktop Setup (Jonathan)

**Canonical local path:** `C:\Users\jonat\OneDrive\Desktop\flux-web`

Open this folder in **Desktop Cursor** (File → Open Folder).

GitHub remote remains source of truth — pull cloud agent branches here.

---

## One-time install (PowerShell)

Run from any directory:

```powershell
Set-Location "C:\Users\jonat\OneDrive\Desktop\flux-web"

# Sync latest War Room + browser MCP branch
git fetch origin
git checkout cursor/war-room-sms-ghl-workflow-a1d1
git pull origin cursor/war-room-sms-ghl-workflow-a1d1

# Build browser MCP
Set-Location "mcp\flux-browser-bridge-mcp-server"
npm install
npm run build
```

Or run the bundled script:

```powershell
& "C:\Users\jonat\OneDrive\Desktop\flux-web\mcp\flux-browser-bridge-mcp-server\scripts\install-local.ps1"
```

---

## Register MCP in Cursor

Merge into `%USERPROFILE%\.cursor\mcp.json` (or use Cursor Settings → Tools & MCP):

```json
{
  "mcpServers": {
    "flux-browser-bridge": {
      "command": "node",
      "args": [
        "C:\\Users\\jonat\\OneDrive\\Desktop\\flux-web\\mcp\\flux-browser-bridge-mcp-server\\dist\\index.js"
      ],
      "env": {
        "FLUX_BROWSER_TRANSPORT": "stdio"
      }
    }
  }
}
```

Restart Cursor after saving.

---

## Start Chrome for GHL automation

```powershell
& "C:\Users\jonat\OneDrive\Desktop\flux-web\mcp\flux-browser-bridge-mcp-server\scripts\start-chrome-debug.ps1"
```

Log into GHL in that Chrome window, then in Desktop Cursor:

```
flux_browser_connect mode=cdp start_url=https://app.gohighlevel.com
```

---

## War Room SMS — remaining step

1. Create **War Room SMS Alert** workflow in GHL (see `docs/deal-machine/SMS-COMET-HANDOFF.md`)
2. Paste Workflow ID into `config/war-room-alerts.json` → `sms.ghl_workflow_id`
3. Run war-room-alert test

---

## Cloud agent vs Desktop

| Task | Where |
|------|-------|
| GHL UI, browser clicks | Desktop Cursor + `flux-browser-bridge` |
| Slack, Gmail, GHL API (Zapier) | Cloud or Desktop MCP |
| Git commits / PRs | Cloud agent pushes → you `git pull` locally |
