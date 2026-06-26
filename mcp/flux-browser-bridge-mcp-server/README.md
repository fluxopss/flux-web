# Flux Browser Bridge MCP — Windows Local Setup

Runs on **your Windows 11 PC** and gives Desktop Cursor direct control of Chrome for GHL UI work (War Room SMS workflow, DND checks, etc.).

Cloud agents cannot reach your local browser directly — this MCP server bridges that gap on Desktop.

---

## Prerequisites

- **Node.js 20+** — https://nodejs.org
- **Google Chrome** installed
- **Desktop Cursor** (not cloud agent)

---

## 1. Install (PowerShell)

From your local `flux-web` repo clone:

```powershell
cd C:\Users\jonat\OneDrive\Desktop\flux-web\mcp\flux-browser-bridge-mcp-server
npm install
npm run build
```

Or one-shot:

```powershell
& "C:\Users\jonat\OneDrive\Desktop\flux-web\mcp\flux-browser-bridge-mcp-server\scripts\install-local.ps1"
```

Playwright downloads Chromium on first install (`postinstall`).

---

## 2. Start Chrome with remote debugging (recommended for GHL login)

This attaches to **your existing logged-in Chrome profile** via CDP.

Close all Chrome windows, then:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="C:\Users\jonat\AppData\Local\Google\Chrome\User Data"
```

Or create a shortcut with those flags. Log into GHL in that Chrome window before asking Cursor to automate.

Verify CDP is up:

```powershell
Invoke-RestMethod http://127.0.0.1:9222/json/version
```

---

## 3. Register in Cursor MCP config

**Settings → Cursor Settings → Tools & MCP → Add custom MCP**

Or edit `%USERPROFILE%\.cursor\mcp.json`:

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

Replace the path with your actual repo location. Restart Cursor.

**Jonathan's path:** `C:\Users\jonat\OneDrive\Desktop\flux-web` — see `docs/deal-machine/LOCAL-SETUP.md`.

---

## 4. First test in Desktop Cursor chat

```
Use flux_browser_connect with mode cdp and start_url https://app.gohighlevel.com
Then flux_browser_snapshot
```

You should see your GHL session (if logged in via debug Chrome).

---

## Tools

| Tool | Purpose |
|------|---------|
| `flux_browser_connect` | Attach/launch Chrome |
| `flux_browser_status` | Connection + current URL |
| `flux_browser_navigate` | Go to URL |
| `flux_browser_snapshot` | Element tree with refs |
| `flux_browser_click` | Click by ref |
| `flux_browser_fill` | Type into input by ref |
| `flux_browser_press_key` | Keyboard |
| `flux_browser_wait` | Load/network/timeout wait |
| `flux_browser_screenshot` | Visual proof |
| `flux_browser_disconnect` | Clean up |

---

## Optional: HTTP mode + tunnel (advanced)

For exposing local MCP over HTTP (e.g. tunnel to cloud):

```powershell
$env:FLUX_BROWSER_TRANSPORT = "http"
$env:FLUX_BROWSER_HTTP_PORT = "3847"
node dist/index.js
```

Endpoint: `http://127.0.0.1:3847/mcp`

**Security:** bind is localhost only. Do not expose without auth.

---

## War Room SMS workflow (GHL)

After connect + navigate to GHL Automation → Workflows:

1. Create **War Room SMS Alert**
2. Trigger: **Contact Added to Workflow**
3. Wait 3s → SMS body: `{{contact.notes}}` → clear notes
4. Publish → copy Workflow ID
5. Paste ID into `config/war-room-alerts.json` → `sms.ghl_workflow_id`

See `docs/deal-machine/SMS-COMET-HANDOFF.md`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on connect | Start Chrome with `--remote-debugging-port=9222` |
| GHL login page | Log in manually in debug Chrome first |
| Tools not visible | Restart Cursor after mcp.json change |
| Wrong Chrome profile | Match `--user-data-dir` to your profile path |
