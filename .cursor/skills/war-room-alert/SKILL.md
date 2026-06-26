---
name: war-room-alert
description: War Room alerts — Slack #war-room hype + Heaven triple-notify (SMS + email + Slack DM) on EVERY update. Jonathan gets SMS + war-room.
---

# War Room Alert — Hype + Heaven Triple Notify

On **every war room update**, notify **Heaven** via all three:
1. **SMS** → +17727754860 (GHL tag ping)
2. **Email** → heaven@fluxlab.agency (Gmail via Zapier)
3. **Slack DM** → `U0BD0RJ9DJ5` + post to `#war-room`

Jonathan gets: `#war-room` post + SMS on critical events.

## Config
- `config/war-room-alerts.json` — full notify policy

---

## Alert Function (Run on EVERY Update)

Given `event_type` and `message`:

### 1. Post to `#war-room` (C0BDLF5JUQ4) — HYPE STYLE

Multiple posts encouraged. Use Zapier bot username `War Room` or Slack MCP.

### 2. Heaven SMS (ALWAYS on update)

```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  lead: "true",
  email: "heaven@fluxlab.agency",
  firstName: "Heaven", lastName: "Yeager",
  phone: "+17727754860",
  tags: "internal_team,war_room_sms,coo,war_room_alert_ping"
)
```

### 3. Heaven Email (ALWAYS on update)

```
execute_zapier_write_action[GoogleMailV2CLIAPI:message](
  to: "heaven@fluxlab.agency",
  subject: "WAR ROOM UPDATE — {headline}",
  body: "{message}\n\n- Flux War Room"
)
```

### 4. Heaven Slack DM (ALWAYS on update)

```
slack_send_message(
  channel_id: "U0BD0RJ9DJ5",
  message: <same hype content>
)
```

### 5. Jonathan SMS (critical events + digests)

Same GHL tag ping for `jonathan@fluxlab.agency` / `+17728674562` on critical triggers.

---

## Heaven Contact Info (Locked)

| Field | Value |
|-------|-------|
| Email | heaven@fluxlab.agency |
| Phone | 772-775-4860 / +17727754860 |
| Slack | U0BD0RJ9DJ5 |
| GHL ID | IfYpm9qp5m1NWYBTCpB4 |

---

## Event Types

All events notify Heaven via SMS + email + Slack DM + war-room post.

Use `war_room_update` for any system/config/pipeline change.

---

## Constraints
- GHL owns SMS delivery (tag `war_room_alert_ping`)
- Gmail sends from connected Flux workspace account
- Always post `#war-room` even if SMS/email fails
- Never SMS prospects — internal Heaven/Jonathan only
