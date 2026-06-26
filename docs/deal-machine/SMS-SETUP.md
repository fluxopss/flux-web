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
| GHL internal contacts | ✅ Jonathan + Heaven with `war_room_sms` tag |
| GHL SMS workflow | ⚠️ Create once in GHL (below) |
| RingCentral SMS | ❌ Not used — texting not enabled |

---

## Step 1 — Create GHL Workflow (One-Time, ~5 min)

In **GoHighLevel → Automation → Workflows → Create**:

### Workflow: `War Room SMS Alert`

**Trigger:** Contact Tag Added → `war_room_alert_ping`

**Actions:**
1. **Wait** — 5 seconds
2. **Send SMS** — To contact (the tagged person)
   ```
   {{contact.first_name}}, War Room: {{contact.last_name}} — check #war-room in Slack. Critical deal updates route here. -Flux War Room
   ```
3. **Remove Tag** — `war_room_alert_ping`

**Publish** the workflow.

### Optional — Dynamic message body

Add a GHL custom field `war_room_alert_message` on contacts. Update workflow SMS to:
```
{{contact.war_room_alert_message}}
```

Cursor can set that field before pinging the tag (when Zapier custom field mapping is available).

---

## How Cursor Fires SMS

The `war-room-alert` skill tags **both** internal GHL contacts with `war_room_alert_ping`:

| Contact | Email | GHL ID |
|---------|-------|--------|
| Jonathan | jonathan@fluxlab.agency | qhGUDsW47iLWg8vscFlZ |
| Heaven | heaven@fluxlab.agency | IfYpm9qp5m1NWYBTCpB4 |

Each tag add triggers the workflow → 1 SMS to that person.

**Zapier action:** `HighLevelCLIAPI:add_update_contact`

---

## What Triggers SMS

From `config/war-room-alerts.json`:

| Event | SMS |
|-------|-----|
| Deal closed | ✅ |
| Stripe payment | ✅ |
| Proposal pitched | ✅ |
| Daily digest (6 AM ET) | ✅ |
| Pitched deal unpaid 48h | ✅ |
| Client fulfillment gap | ✅ |
| System / critical alert | ✅ |
| Record audit gaps | Slack only |
| Enrichment complete | Slack only |

---

## Manual Test

After the GHL workflow is published, ask Cursor:

```
Run war-room-alert for war_room_system with message "SMS test — War Room is live"
```

You and Heaven should each receive a GHL text within ~30 seconds.

---

## Constraints

- **GHL owns all SMS** — prospects and internal team
- **Never use RingCentral** for War Room alerts
- Cursor always posts Slack `#war-room` even if GHL SMS fails
- Internal contacts only — customer SMS stays in GHL stage workflows
