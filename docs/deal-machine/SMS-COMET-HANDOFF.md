# War Room SMS — Browser Handoff (GHL UI)

**Blocker:** `War Room SMS Alert` workflow does not exist. Only workflows 01–12 are published in GHL. Tag `war_room_alert_ping` has nothing to fire.

**Fix:** Create internal workflow via GHL UI, then paste Workflow ID into `config/war-room-alerts.json` → `sms.ghl_workflow_id`.

---

## Architecture (locked)

| Step | Owner | Action |
|------|-------|--------|
| Set alert text | Cursor/Zapier | `add_update_contact` → write **notes** |
| Fire SMS | Cursor/Zapier | `campaign` → enroll in **War Room SMS Alert** only |
| Customer SMS | GHL stage workflows | Never via Zapier |

**Exception:** Internal War Room SMS Alert enrollment is the only allowed `campaign` call.

---

## Pre-flight — DND off

| Person | Email | GHL ID | Phone |
|--------|-------|--------|-------|
| Jonathan | jonathan@fluxlab.agency | qhGUDsW47iLWg8vscFlZ | +17728674562 |
| Heaven | heaven@fluxlab.agency | IfYpm9qp5m1NWYBTCpB4 | +17727754860 |

On each contact: **DND → OFF** for SMS. Save.

---

## Create workflow (GHL UI)

**Option A — Desktop Cursor + `flux-browser-bridge` MCP (recommended)**  
See `mcp/flux-browser-bridge-mcp-server/README.md` — controls your local Chrome from Desktop Cursor.

**Option B — Manual clicks**

1. **Automation → Workflows → Create Workflow → Start from Scratch**
2. Name: **`War Room SMS Alert`**
3. **Trigger:** Contact Added to Workflow *(NOT Tag Added)*
4. **Action 1:** Wait → **3 seconds**
5. **Action 2:** Send SMS → body: `{{contact.notes}}`
6. **Action 3 (optional):** Update Contact Field → Notes → clear/blank
7. **Publish**

### Capture Workflow ID

From URL while editing (`.../workflow/<ID>`) or Workflow Settings. Paste into repo config.

---

## Manual smoke test

1. Open Jonathan contact → Notes: `SMS test — War Room is live` → Save
2. **Add to Workflow** → War Room SMS Alert → confirm text on 772-867-4562
3. Repeat for Heaven → 772-775-4860

---

## Automated path (after ID in config)

```
# Jonathan
add_update_contact(email, phone, notes: "{message}")
campaign(campaign_id: ghl_workflow_id, email: jonathan@fluxlab.agency)

# Heaven
add_update_contact(email, phone, notes: "{message}")
campaign(campaign_id: ghl_workflow_id, email: heaven@fluxlab.agency)
```

Plus unchanged: Slack `#war-room` + DMs + Gmail to both.

---

## Do NOT touch

- FLA-2026-102 through 106 (wf_03 running)
- Customer workflow enrollment via Zapier
- RingCentral SMS (not enabled)
