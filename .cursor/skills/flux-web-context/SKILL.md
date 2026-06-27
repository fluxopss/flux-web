---
name: flux-web-context
description: Bootstrap skill — load integrated context from ALL flux-web chats before any action. Use at start of every cloud, desktop, or new session.
---

# Flux-Web Context — Chat Integration Bootstrap

**Run this first in every flux-web chat.**

## Step 1 — Load integrated memory

```
Read config/flux-web-integrated-context.json
Read automation/deal-machine-tracker.json
Read docs/flux-web/INTEGRATED-CONTEXT.md (if human context needed)
```

## Step 2 — Load canonical ops

```
Read config/flux-ops-canonical.json
Read config/flow-ownership.json
```

## Step 3 — Pick skill by task

| Task | Skill |
|------|-------|
| Hunt / lead gen | `deal-hunter` + `config/lead-gen-config.json` |
| Audit / close / digest | `deal-orchestrator` |
| War Room post | `war-room` + `war-room-alert` |
| Pitch / proposal | `deal-hunter` + `config/proposal-template-canonical.json` |
| Payment confirmed | `ghl-stripe-close` |
| Client records | `client-fulfillment` |

## Step 4 — Check blockers

From integrated context `blockers[]`:
- GHL War Room SMS workflow missing → skip SMS, still Slack + email
- FLA-102–106 → DO NOT re-pitch

## Step 5 — Report state

After any run, update `automation/deal-machine-tracker.json` and post to `#war-room` (C0BDLF5JUQ4).

## Golden rules (never violate)

1. `#war-room` for all deal ops — not `#project-update`
2. Jonathan + Heaven triple-notify on every war room update
3. GHL stage triggers workflows — no Zapier `campaign` for customers
4. Proposals = 6-slide HTML per reliable-roofer template
5. Cursor owns B2B lead gen
6. Stripe verifies before Contract Signed

## Environment detection

| Signal | Mode |
|--------|------|
| Cloud agent / PR branch | Autopilot: hunt, verify, hype |
| Desktop + local paths mentioned | GHL UI, SMS workflow, local knowledge files |
| User says "integrate chats" | Refresh integrated context docs only |

## After completing work

- Commit meaningful config/tracker updates
- Push branch `cursor/deal-machine-stripe-ghl-fd95`
- Update PR #1 if on that branch
