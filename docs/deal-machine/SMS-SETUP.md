# War Room SMS Setup — GHL Only

**Goal:** Every critical deal event texts **both** numbers via **GoHighLevel**:
- Jonathan: **772-867-4562** (`+17728674562`)
- Heaven: **772-775-4860** (`+17727754860`)

RingCentral does **not** have texting enabled. All War Room SMS routes through GHL.

---

## Status

| Channel | Status |
|---------|--------|
| Slack `#war-room` | ✅ Live |
| GHL internal contacts | ✅ Jonathan + Heaven |
| GHL SMS workflow | ❌ **Create `War Room SMS Alert` in GHL UI** |
| RingCentral SMS | ❌ Not used |

**Verified 2026-06-26:** Zapier `campaign` lists only workflows 01–12. `War Room SMS Alert` does not exist yet.

---

## Step 1 — Create GHL Workflow (One-Time)

See **`docs/deal-machine/SMS-COMET-HANDOFF.md`** for click-by-click browser steps.

### Workflow: `War Room SMS Alert`

**Trigger:** Contact Added to Workflow *(NOT Tag Added)*

**Actions:**
1. **Wait** — 3 seconds
2. **Send SMS** — body: `{{contact.notes}}`
3. **Clear Notes** (optional) — prevents resend on re-enrollment

**Publish** and copy Workflow ID into `config/war-room-alerts.json` → `sms.ghl_workflow_id`.

---

## How Cursor Fires SMS

1. Set contact **notes** via `HighLevelCLIAPI:add_update_contact`
2. Enroll via `HighLevelCLIAPI:campaign` with `sms.ghl_workflow_id`

| Contact | Email | GHL ID |
|---------|-------|--------|
| Jonathan | jonathan@fluxlab.agency | qhGUDsW47iLWg8vscFlZ |
| Heaven | heaven@fluxlab.agency | IfYpm9qp5m1NWYBTCpB4 |

---

## Manual Test

After workflow is published and ID is in config:

```
Run war-room-alert for war_room_system with message "SMS test — War Room is live"
```

Both numbers should receive GHL text within ~30 seconds.

---

## Constraints

- **GHL owns all SMS** — prospects and internal team
- **Never use RingCentral** for War Room alerts
- Cursor always posts Slack `#war-room` even if GHL SMS fails
- Internal contacts only — customer SMS stays in GHL stage workflows
- **Only exception** to no-campaign rule: internal War Room SMS Alert enrollment
