---
name: war-room-alert
description: War Room alerts — Slack #war-room hype + triple-notify BOTH Jonathan and Heaven (SMS + email + Slack DM) on EVERY update. Internal contacts only.
---

# War Room Alert — Leadership Triple Notify

On **every war room update**, notify **both** leaders via all three channels:

| Person | Email | Phone | Slack | GHL ID |
|--------|-------|-------|-------|--------|
| **Jonathan** | jonathan@fluxlab.agency | 772-867-4562 | U0ATJ7BKGT1 | qhGUDsW47iLWg8vscFlZ |
| **Heaven** | heaven@fluxlab.agency | 772-775-4860 | U0BD0RJ9DJ5 | IfYpm9qp5m1NWYBTCpB4 |

**Internal only.** Never use prospect emails/phones.

## Config
- `config/war-room-alerts.json` → `update_notify_policy`, `sms.ghl_workflow_id`

---

## Alert Function (Run on EVERY Update)

Load `sms.ghl_workflow_id` from config. If null, skip SMS and log blocker — still fire Slack + email.

### 1. Post to `#war-room` (C0BDLF5JUQ4) — HYPE

```
slack_send_message(channel_id: "C0BDLF5JUQ4", message: ...)
```

### 2. SMS both (GHL notes + workflow enrollment)

**Only allowed `campaign` exception.** Workflow: `War Room SMS Alert`.

For each person (Jonathan, then Heaven):

```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  email: "...",
  phone: "+1...",
  notes: "{message}\n\n- Flux War Room"
)

execute_zapier_write_action[HighLevelCLIAPI:campaign](
  campaign_id: "{sms.ghl_workflow_id}",
  email: "..."
)
```

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

## Constraints
- GHL owns SMS — notes + internal workflow enrollment only
- Never enroll customer workflows via Zapier
- Gmail from Flux workspace
- Always post `#war-room` even if GHL SMS fails
- Internal leadership only

## Setup blocker
If SMS fails: workflow `War Room SMS Alert` must exist in GHL UI. See `docs/deal-machine/SMS-COMET-HANDOFF.md`.
