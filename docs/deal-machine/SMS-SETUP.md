# War Room SMS Setup — Jonathan + Heaven

**Goal:** Every critical deal event texts **both** numbers:
- Jonathan: **772-867-4562** (`+17728674562`)
- Heaven: **772-775-4860** (`+17727754860`)

Slack `#war-room` is live. SMS uses **GHL internal workflow** (primary) until RingCentral Zapier permissions are fixed.

---

## Status (2026-06-26)

| Channel | Status |
|---------|--------|
| Slack `#war-room` | ✅ Live — Cursor posts here |
| GHL internal contacts | ✅ Jonathan + Heaven created with `war_room_sms` tag |
| GHL SMS workflow | ⚠️ **You must create** (5 min, one-time) |
| RingCentral via Zapier | ❌ Blocked — `OutboundSMS` permission missing on OAuth app |
| Twilio via Zapier | ❌ Needs auth at [mcp.zapier.com](https://mcp.zapier.com) |

---

## Step 1 — Create GHL Workflow (Recommended, 5 min)

In **GoHighLevel → Automation → Workflows → Create**:

### Workflow: `War Room SMS Alert`

**Trigger:** Contact Tag Added → `war_room_alert_ping`

**Actions:**
1. **Wait** — 5 seconds (prevents double-fire)
2. **Send SMS** — To contact (the tagged person)
   - Message:
     ```
     {{contact.first_name}}, War Room alert: check #war-room in Slack for details. Critical deal updates route here. -Flux War Room
     ```
3. **Remove Tag** — `war_room_alert_ping`
4. **Internal Notification** (optional) — Assign to Heaven if Jonathan triggered, vice versa

**Publish** the workflow.

### How Cursor fires it

The `war-room-alert` skill adds tag `war_room_alert_ping` to **both** internal GHL contacts:
- `jonathan@fluxlab.agency`
- `heaven@fluxlab.agency`

Each tag add = 1 SMS to that person. Both tagged = both get texted.

---

## Step 2 — Fix RingCentral (Optional Backup)

The Zapier RingCentral connection (`contact@fluxlab.agency`) can list phone numbers but **cannot send SMS** until OutboundSMS is granted.

1. Log into [RingCentral Admin](https://service.ringcentral.com)
2. **Users** → `contact@fluxlab.agency` (or the Zapier OAuth user)
3. **Roles & Permissions** → enable **Outbound SMS**
4. Re-test in Zapier: RingCentral → Send SMS from `+17727427052`

**Confirmed numbers on account:**
| Number | ID | Primary |
|--------|-----|---------|
| +17727427052 | 2563383011 | Yes |
| +17722243762 | 2563382011 | No |

---

## Step 3 — Twilio Backup (Optional)

1. Open [Zapier MCP Twilio auth](https://mcp.zapier.com/mcp/servers/7689f0ca-91eb-43f4-a60c-4f232bfa55c4/app-auth/TwilioCLIAPI)
2. Connect Twilio account
3. Update `config/war-room-alerts.json` → set `sms.provider` to `twilio`

---

## What Triggers SMS

Configured in `config/war-room-alerts.json`:

| Event | SMS |
|-------|-----|
| Deal closed | ✅ |
| Stripe payment | ✅ |
| Proposal pitched | ✅ |
| Daily digest (6 AM ET) | ✅ |
| Pitched deal unpaid 48h | ✅ |
| Client fulfillment gap | ✅ |
| System launch / critical | ✅ |
| Record audit gaps | Slack only |
| Enrichment complete | Slack only |

---

## Manual Test (PowerShell on your PC)

After GHL workflow is published, ask Cursor:

```
Run war-room-alert for war_room_system with message "SMS test — War Room is live"
```

You and Heaven should each receive a text within ~30 seconds.

---

## Zapier Zap Template (If You Prefer Zapier Over GHL)

**Trigger:** Webhook (Catch Hook) — save URL in `config/war-room-alerts.json` → `zapier_webhook_url`

**Action 1:** RingCentral Send SMS → Jonathan
**Action 2:** RingCentral Send SMS → Heaven

Payload:
```json
{
  "event": "deal_closed",
  "message": "DEAL CLOSED: Jacquin & Sons | FLA-2026-102 | $1694",
  "fla_ref": "FLA-2026-102"
}
```
