# Cursor Automation Prompts — Copy-Paste at cursor.com/automations

Repo: **fluxopss/flux-web** | Branch: **main** | Timezone: **America/New_York**

Enable: **MCP** (Zapier, Slack, Stripe) + **Send to Slack**

---

## 1. Flux Morning Deal Machine

**Cron:** `0 6 * * 1-6`

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

## 2. Flux Stripe Close Verifier

**Cron:** `*/30 * * * *`

```
Load flux-web-context. Run deal-orchestrator mode verify_close for FLA-2026-102, 103, 104, 105, 106, 107.

If payment confirmed: advance GHL to Contract Signed, post celebration to #war-room (C0BDLF5JUQ4) and #sold-clients (C0AU0M839RD), war-room-alert leadership.
If no payment: no writes. Update tracker only if state changed.
```

---

## 3. Flux Enrichment Queue (optional)

**Cron:** `0 8 * * 1,3,5`

```
Load flux-web-context. Run deal-orchestrator mode enrichment_queue. Apollo per-lead only. Post to #war-room. Flag comet_scrape_needed if Apollo fails.
```

---

## 4. Flux Client Fulfillment (optional)

**Cron:** `0 9 * * 5`

```
Load flux-web-context. Run client-fulfillment mode fulfill_all_active. Post to #sold-clients. Gaps to #war-room.
```
