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

---

## Alert Function (Run on EVERY Update)

### 1. Post to `#war-room` (C0BDLF5JUQ4) — HYPE

### 2. SMS both (GHL tag `war_room_alert_ping`)

Jonathan:
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  email: "jonathan@fluxlab.agency", phone: "+17728674562",
  tags: "internal_team,war_room_sms,ceo,war_room_alert_ping"
)
```

Heaven:
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  email: "heaven@fluxlab.agency", phone: "+17727754860",
  tags: "internal_team,war_room_sms,coo,war_room_alert_ping"
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

## GHL Contact IDs

| Person | GHL ID |
|--------|--------|
| Jonathan | qhGUDsW47iLWg8vscFlZ |
| Heaven | IfYpm9qp5m1NWYBTCpB4 |

---

## Constraints
- GHL owns SMS (tag trigger workflow)
- Gmail from Flux workspace
- Always post `#war-room` even if other channels fail
- Internal leadership only
