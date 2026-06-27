# Flux-Web Deal Machine — Step-by-Step Setup

**Goal:** Hands-off automation — agents hunt, GHL nurtures, Stripe closes, you watch `#war-room`.

**Time:** ~45–60 minutes one-time setup.

---

## Phase 0 — Accounts (10 min)

Confirm these are connected in **Cursor → Settings → Tools & MCP**:

| Integration | Used for |
|-------------|----------|
| **GitHub** | `fluxopss/flux-web` repo |
| **Zapier** | GHL, Gmail, Apollo, Slack |
| **Slack** | `#war-room`, DMs |
| **Stripe** | Payment verify + close |

In **Zapier** (mcp.zapier.com), confirm connected:
- LeadConnector (GHL)
- Gmail
- Apollo
- Slack

Optional / blocked:
- Twilio — needs auth if you want backup SMS
- RingCentral — not primary (texting not enabled)

---

## Phase 1 — Git (5 min)

### Step 1.1 — Merge the deal machine to `main`

1. Open https://github.com/fluxopss/flux-web/pull/1
2. Review changes (or trust and merge)
3. Click **Merge pull request**
4. Delete branch optional — `main` is now the source of truth

### Step 1.2 — Pull on Desktop (if you use it)

```powershell
cd C:\path\to\flux-web
git checkout main
git pull origin main
```

---

## Phase 2 — GHL one-time (Desktop, 15 min)

### Step 2.1 — War Room SMS workflow (unblocks texts)

1. Open **GoHighLevel → Automation → Workflows → Create**
2. Name: `War Room SMS Alert`
3. Trigger: **Contact Added to Workflow**
4. Actions:
   - Wait 3 sec
   - Send SMS: `{{contact.first_name}}, War Room: {{contact.notes}} — check #war-room. -Flux War Room`
5. **Publish**
6. Copy **Workflow ID** from URL or settings

### Step 2.2 — Paste workflow ID into config

On Desktop Cursor (or cloud agent):

```
Update config/war-room-alerts.json → sms.ghl_workflow_id with [paste ID]
Update config/ghl-workflows-registry.json internal war_room_sms_alert id
Commit and push to main
```

### Step 2.3 — Verify internal contacts (SMS DND off)

| Contact | Phone |
|---------|-------|
| Jonathan | jonathan@fluxlab.agency / 772-867-4562 |
| Heaven | heaven@fluxlab.agency / 772-775-4860 |

### Step 2.4 — Confirm GHL customer workflows live

Workflows 01–04 must be **published** (stage triggers):
- 01 New Lead capture
- 02 Qualify
- 03 Proposal
- 04 Onboard

---

## Phase 3 — Cursor Automations (20 min)

Create automations at **https://cursor.com/automations** (or Agents Window → Automations).

For each automation:
- **Repository:** `fluxopss/flux-web`
- **Branch:** `main`
- **Tools:** Enable **MCP** (Zapier, Slack, Stripe) + **Send to Slack**
- **Permissions:** Team Owned (recommended) or Private

---

### Automation 1 — Morning Deal Machine (MOST IMPORTANT)

| Setting | Value |
|---------|-------|
| **Name** | `Flux Morning Deal Machine` |
| **Trigger** | Scheduled — cron `0 6 * * 1-6` (6 AM ET Mon–Sat) |
| **Repo** | `fluxopss/flux-web` @ `main` |

**Prompt (copy-paste):**

```
Load flux-web-context skill. Read config/flux-web-integrated-context.json and automation/deal-machine-tracker.json.

1. Run deal-orchestrator mode digest — post to Slack #war-room (C0BDLF5JUQ4)
2. Run deal-hunter mode hunt — 25 leads, rotate niche, pitch top 5 max
3. Run deal-orchestrator mode audit — post gaps to #war-room
4. war-room-alert both Jonathan and Heaven on every update
5. Update automation/deal-machine-tracker.json with results
6. Commit and push to main if tracker changed

RULES: Do not re-pitch FLA-2026-102 through 106. GHL stage only — no customer campaign enroll. Post deal ops to #war-room only.
```

---

### Automation 2 — Stripe Close Watcher

| Setting | Value |
|---------|-------|
| **Name** | `Flux Stripe Close Verifier` |
| **Trigger** | Scheduled — cron `*/30 * * * *` (every 30 min) |
| **Repo** | `fluxopss/flux-web` @ `main` |

**Prompt:**

```
Load flux-web-context. Run deal-orchestrator mode verify_close for FLA-2026-102, 103, 104, 105, 106, 107.

If payment confirmed: advance GHL to Contract Signed (stage trigger fires wf_04), post celebration to #war-room and #sold-clients, war-room-alert leadership.

If no payment: no writes. Update tracker only if state changed.
```

---

### Automation 3 — Enrichment gap-fill (Mon/Wed/Fri)

| Setting | Value |
|---------|-------|
| **Name** | `Flux Enrichment Queue` |
| **Trigger** | Scheduled — cron `0 8 * * 1,3,5` |
| **Repo** | `fluxopss/flux-web` @ `main` |

**Prompt:**

```
Load flux-web-context. Run deal-orchestrator mode enrichment_queue. Apollo per-lead only. Post results to #war-room. Flag comet_scrape_needed if Apollo fails.
```

---

### Automation 4 — Friday client fulfillment

| Setting | Value |
|---------|-------|
| **Name** | `Flux Client Fulfillment` |
| **Trigger** | Scheduled — cron `0 9 * * 5` |
| **Repo** | `fluxopss/flux-web` @ `main` |

**Prompt:**

```
Load flux-web-context. Run client-fulfillment mode fulfill_all_active. Post to #sold-clients (C0AU0M839RD). Gaps to #war-room.
```

---

### Automation 5 (optional) — Saturday St Lucie hunt

| Setting | Value |
|---------|-------|
| **Name** | `Flux Saturday Hunt` |
| **Trigger** | Scheduled — cron `0 8 * * 6` |
| **Repo** | `fluxopss/flux-web` @ `main` |

**Prompt:**

```
Load flux-web-context. Run deal-hunter hunt — 15 leads, geo St Lucie County FL, pitch top 3. Post to #war-room. war-room-alert leadership.
```

---

## Phase 4 — Stripe webhooks (10 min, if not done)

In **Stripe Dashboard → Developers → Webhooks**:

Events:
- `checkout.session.completed`
- `invoice.paid`
- `customer.subscription.created`

Route to your website automation OR rely on Cursor `verify_close` every 30 min (already configured).

**Minimum for automation:** 30-min verifier is enough; webhooks make closes instant.

---

## Phase 5 — Test run (10 min)

### Step 5.1 — Manual test one automation

1. Go to https://cursor.com/automations
2. Open **Flux Morning Deal Machine**
3. Click **Run now** (if available) or wait for 6 AM

### Step 5.2 — Verify outputs

| Check | Pass? |
|-------|-------|
| `#war-room` got hunt/digest post | ☐ |
| Jonathan + Heaven got Slack DM | ☐ |
| Jonathan + Heaven got email | ☐ |
| GHL has new leads (if hunt ran) | ☐ |
| Tracker updated on `main` | ☐ |

### Step 5.3 — Test SMS (after Phase 2)

```
Load flux-web-context. Run war-room-alert war_room_system with message "SMS test — automation live"
```

---

## Phase 6 — Your daily routine (after setup)

**You do this only:**

1. Open Slack → `#war-room` (2 min)
2. Answer phone / follow up pitched deals
3. Chat with Cursor **only** when steering (new niche, pricing change, blocker)

**You do NOT:**
- Manually move GHL stages for new leads
- Send prospect emails (GHL does)
- Run hunts by hand
- Open new chats for routine ops

---

## Quick reference

| What | Where |
|------|-------|
| Integrated memory | `config/flux-web-integrated-context.json` |
| Live pipeline | `automation/deal-machine-tracker.json` |
| Schedule spec | `automation/deal-machine-schedule.json` |
| Bootstrap any chat | `Load flux-web-context` |
| Automations UI | https://cursor.com/automations |
| PR / repo | https://github.com/fluxopss/flux-web |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No Slack posts | Re-auth Slack MCP; check channel C0BDLF5JUQ4 |
| GHL writes fail | Re-auth Zapier LeadConnector; include `country: US` on contacts |
| No texts | Complete Phase 2 — workflow ID in config |
| Agent re-pitches old deals | Prompt must say DO NOT TOUCH FLA-102–106 |
| Duplicate work cloud + desktop | Cloud = autopilot; Desktop = GHL UI only |

---

## Alternative: `/automate` in Desktop Cursor

In Desktop Cursor chat:

```
/automate

Create a scheduled automation for fluxopss/flux-web on main that runs every day at 6 AM ET:
Load flux-web-context, run deal-orchestrator digest, deal-hunter hunt (25 leads, pitch top 5), deal-orchestrator audit, post to #war-room, war-room-alert leadership, update tracker, commit if changed.
Enable MCP for Zapier Slack and Stripe.
```

Repeat for the 30-min Stripe verifier.
