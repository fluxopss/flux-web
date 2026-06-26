# War Room SMS Setup — GHL Only

**Goal:** Every critical deal event texts **both** numbers via **GoHighLevel**:
- Jonathan: **772-867-4562** (`+17728674562`)
- Heaven: **772-775-4860** (`+17727754860`)

RingCentral does **not** have texting enabled. All War Room SMS routes through GHL.

---

## Root Cause (2026-06-26 audit)

| Issue | Status |
|-------|--------|
| `War Room SMS Alert` workflow in GHL | **MISSING** — not in the 12 published workflows |
| Tag `war_room_alert_ping` re-fire | Unreliable — tag may already exist; no workflow listening |
| Zapier direct SMS action | Not available on LeadConnector connector |
| RingCentral SMS | OutboundSMS permission blocked; texting not enabled |

**Fix:** Create the GHL workflow once (Comet), then Cursor enrolls contacts via Zapier `Add Lead to Workflow`.

---

## Step 1 — Comet creates GHL workflow (one-time, ~5 min)

In **GoHighLevel → Automation → Workflows → Create**:

### Workflow: `War Room SMS Alert`

**Trigger:** Contact Added to Workflow *(NOT tag added — Zapier cannot re-fire tags reliably)*

**Actions:**
1. **Wait** — 3 seconds
2. **Send SMS** — To contact
   ```
   {{contact.first_name}}, War Room: {{contact.notes}}

   Check #war-room in Slack for deal updates.
   -Flux War Room
   ```
3. **Clear Contact Notes** *(optional — keeps records clean)*

**Publish** the workflow.

**After publish:** Copy the workflow ID from the URL or workflow settings and paste into:
- `config/war-room-alerts.json` → `sms.ghl_workflow_id`
- `config/ghl-workflows-registry.json` → `internal_workflows.war_room_sms_alert.id`

---

## Step 2 — How Cursor fires SMS (reliable path)

Two Zapier calls per person:

### A. Set alert message on contact
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  email: "jonathan@fluxlab.agency",
  phone: "+17728674562",
  lead: "false",
  notes: "WAR ROOM: {message}"
)
```

### B. Enroll in War Room workflow (sends SMS)
```
execute_zapier_write_action[HighLevelCLIAPI:campaign](
  campaign_id: "<war_room_workflow_id>",
  email: "jonathan@fluxlab.agency",
  phone: "+17728674562",
  firstName: "Jonathan",
  lastName: "Augusto"
)
```

Repeat for Heaven (`heaven@fluxlab.agency`, `+17727754860`).

| Contact | Email | GHL ID |
|---------|-------|--------|
| Jonathan | jonathan@fluxlab.agency | qhGUDsW47iLWg8vscFlZ |
| Heaven | heaven@fluxlab.agency | IfYpm9qp5m1NWYBTCpB4 |

---

## GHL workflows currently in account (verified 2026-06-26)

These exist — **War Room SMS Alert is NOT among them**:

1. Workflow - 01 \| New Lead – Intake & Nurture
2. Workflow - 02 \| Lead Replied – AI Qualification + Route
3. Workflow - 03 \| Booked – Discovery Call Confirmation
4. Workflow - 04 \| Won – Client Onboarding Emails
5. Workflow - 05 \| Alert – Missed Call
6. Workflow - 06 \| Alert – Voice AI Lead Notification
7. Workflow - 07 \| Overdue Payment – Follow-Up Sequence
8. Workflow - 08 \| Proposal Sent – 3-Day Follow-Up
9. Workflow - 09 \| Won – Review Request
10. Workflow - 10 \| Lead No Reply – 7-Day Reactivation
11. Workflow - 11 \| Monthly Retainer Check-In
12. Workflow - 12 \| New Client Welcome Sequence

---

## What triggers SMS

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

## Manual test (after Comet publishes workflow)

```
Run war-room-alert for war_room_system with message "SMS test — War Room is live"
```

You and Heaven should each receive a GHL text within ~30 seconds.

---

## RingCentral (backup only — not primary)

RingCentral texting is **not enabled** on `contact@fluxlab.agency`. To enable as backup:

1. Log in at https://support.ringcentral.com
2. Open case: **Enable SMS / OutboundSMS on contact@fluxlab.agency**
3. Request: grant `OutboundSMS` scope to Zapier OAuth app + enable A2P 10DLC for Flux Labs numbers
4. Verify: send test from RingCentral app to 772-867-4562

**Primary path remains GHL.** RingCentral is optional fallback only.

---

## Constraints

- **GHL owns all SMS** — prospects and internal team
- **Never use RingCentral** for War Room alerts until explicitly enabled
- Cursor always posts Slack `#war-room` even if GHL SMS fails
- Internal contacts only — customer SMS stays in GHL stage workflows
- Zapier `campaign` enrollment is **allowed for internal War Room workflow only** — never for customer nurture workflows
