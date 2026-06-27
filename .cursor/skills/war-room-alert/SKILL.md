---
name: war-room-alert
description: War Room alerts — MONSTER HYPE posts to #war-room ONLY (tag Jonathan + Heaven). Plus email + GHL SMS. No Slack DMs.
---

# War Room Alert — Hype + Notify

**ALL Slack → `#war-room` only.** @mention leaders. No DMs.

On every update:
1. **5+ hype posts** to `#war-room` (C0BDLF5JUQ4) — use `war-room` skill voice
2. **@mention** `<@U0ATJ7BKGT1>` and `<@U0BD0RJ9DJ5>` in war-room
3. **Email** both via Gmail
4. **SMS** both via GHL workflow (when configured)

## Config
- `config/war-room-alerts.json`

---

## Alert Function

### 1. Monster hype burst in `#war-room` (REQUIRED — 5+ messages)

Use `war-room` skill. Post separately:
- Siren opener ($ at stake)
- Scoreboard
- Deal board (each FLA)
- Today's kill target
- Close script

Tag: `<@U0ATJ7BKGT1> <@U0BD0RJ9DJ5>`

**Do NOT Slack DM.** War-room only.

### 2. SMS (GHL — when workflow ID set)

Skip if `sms.ghl_workflow_id` is null.

Per person: set `notes` → enroll `War Room SMS Alert` workflow.

### 3. Email (Gmail)

To jonathan@fluxlab.agency + heaven@fluxlab.agency  
Subject: `WAR ROOM — {headline}`

---

## Constraints
- Slack = war-room ONLY
- Internal leadership only
- Always hype before email/SMS
