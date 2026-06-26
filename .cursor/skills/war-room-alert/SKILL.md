---
name: war-room-alert
description: War Room alerts — Slack #war-room hype + triple-notify BOTH Jonathan and Heaven (SMS + email + Slack DM) on EVERY update. Internal contacts only.
---

# War Room Alert — Leadership Triple Notify

On **every war room update**, notify **both** leaders via all three channels:

| Person | Email | Phone | Slack |
|--------|-------|-------|-------|
| **Jonathan** | jonathan@fluxlab.agency | 772-867-4562 | U0ATJ7BKGT1 |
| **Heaven** | heaven@fluxlab.agency | 772-775-4860 | U0BD0RJ9DJ5 |

**Internal only.** Never use prospect emails/phones.

## Config
- `config/war-room-alerts.json` → `update_notify_policy`
- `config/war-room-alerts.json` → `sms.ghl_workflow_id` (must be set after Comet creates workflow)

---

## Alert Function (Run on EVERY Update)

### 1. Post to `#war-room` (C0BDLF5JUQ4) — HYPE

### 2. SMS both (GHL workflow enrollment)

**Prerequisite:** `War Room SMS Alert` workflow exists in GHL with trigger `Contact Added to Workflow`.
If `sms.ghl_workflow_id` is null → skip SMS, post blocker to `#war-room`, continue other channels.

**Per person (Jonathan, then Heaven):**

Step A — set message on contact notes:
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  email: "<email>",
  phone: "<phone_e164>",
  lead: "false",
  notes: "WAR ROOM: {message}"
)
```

Step B — enroll in War Room SMS workflow:
```
execute_zapier_write_action[HighLevelCLIAPI:campaign](
  campaign_id: "<sms.ghl_workflow_id from config>",
  email: "<email>",
  phone: "<phone_e164>",
  firstName: "<first>",
  lastName: "<last>"
)
```

| Person | Email | Phone | GHL ID |
|--------|-------|-------|--------|
| Jonathan | jonathan@fluxlab.agency | +17728674562 | qhGUDsW47iLWg8vscFlZ |
| Heaven | heaven@fluxlab.agency | +17727754860 | IfYpm9qp5m1NWYBTCpB4 |

### 3. Email both (Gmail)

```
execute_zapier_write_action[GoogleMailV2CLIAPI:message](
  to: "jonathan@fluxlab.agency" | "heaven@fluxlab.agency",
  subject: "WAR ROOM UPDATE — {headline}",
  body: "{message}\n\n- Flux War Room"
)
```

### 4. Slack DM both

```
slack_send_message(channel_id: "U0ATJ7BKGT1", message: ...)  # Jonathan
slack_send_message(channel_id: "U0BD0RJ9DJ5", message: ...)  # Heaven
```

---

## SMS blocker (current)

As of 2026-06-26: `War Room SMS Alert` workflow **does not exist** in GHL.
Comet must create it — see `docs/deal-machine/SMS-COMET-HANDOFF.md`.

Until workflow ID is in config, SMS steps are skipped. Slack + email still fire.

---

## Constraints
- GHL owns SMS via workflow enrollment (not tag ping)
- Gmail from Flux workspace
- Always post `#war-room` even if GHL SMS fails
- Internal leadership only
- `campaign` enrollment allowed **only** for internal War Room workflow — never customer workflows
