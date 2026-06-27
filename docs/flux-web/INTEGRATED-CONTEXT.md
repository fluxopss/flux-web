# Flux-Web — Integrated Chat Context

**Purpose:** One brain for **all** flux-web Cursor chats (cloud agent, desktop, future sessions).  
**Machine-readable:** `config/flux-web-integrated-context.json`  
**Bootstrap skill:** `.cursor/skills/flux-web-context/SKILL.md`

Every new chat should load this doc (or the JSON) before acting.

---

## What We Built (Across All Chats)

| System | Status |
|--------|--------|
| Deal Machine orchestration | ✅ Live |
| War Room `#war-room` hype channel | ✅ Live |
| Leadership triple-notify (Slack + email) | ✅ Live |
| GHL SMS to Jonathan + Heaven | ❌ Blocked — workflow missing |
| Cursor B2B lead gen (`deal-hunter`) | ✅ Live — Mon–Fri 7 AM |
| Stripe close verifier (30 min) | ✅ Watching FLA-102–107 |
| Proposal gold standard | ✅ `reliable-roofer-dedicated.html` |
| PR / branch | `cursor/deal-machine-stripe-ghl-fd95` — PR #1 |

---

## Architecture (Locked)

```
Cursor (deal-hunter)  →  discover, enrich, intake, qualify, pitch
GHL stage change      →  wf_01 / wf_02 / wf_03 / wf_04 auto-fire
Website               →  Stripe checkout + monthly billing
Stripe verifier       →  payment → Contract Signed
War Room              →  hype + leadership alerts
Comet / Desktop       →  GHL UI, SMS workflow create, browser fallback
```

| Owner | Owns | Never |
|-------|------|-------|
| **Cursor** | Lead gen, audit, gap-fill, stage sync, Stripe verify, War Room | Customer SMS/email |
| **GHL** | Pipeline, workflows, nurture, trials | Zapier customer campaign enroll |
| **Website** | Stripe payments | Duplicate checkout links |
| **Comet** | GHL UI clicks, fallback scrape | Duplicate lead gen |

---

## Slack — Where Chats Go

| Channel | ID | Use |
|---------|-----|-----|
| **#war-room** | `C0BDLF5JUQ4` | **All deal ops** — hunts, pitches, audits, hype |
| **#sold-clients** | `C0AU0M839RD` | Closes + onboarding only |
| **#project-update** | `C0BB67LRDLZ` | Engineering only — **never deal ops** |
| **#company-data** | `C0BANTREPPH` | Data — not default |
| **#ai-master** | `C0BAP014AQ7` | AI config — not default |

---

## Leadership (Triple-Notify Every Update)

| Person | Email | Phone | Slack | GHL ID |
|--------|-------|-------|-------|--------|
| Jonathan | jonathan@fluxlab.agency | 772-867-4562 | `U0ATJ7BKGT1` | `qhGUDsW47iLWg8vscFlZ` |
| Heaven | heaven@fluxlab.agency | 772-775-4860 | `U0BD0RJ9DJ5` | `IfYpm9qp5m1NWYBTCpB4` |

Channels per update: `#war-room` + Slack DM + Gmail (+ GHL SMS when workflow exists).

---

## Pipeline (Do Not Break)

**Pipeline:** `RbSKp5WldAzJFgDOwoMO` — Flux Labs Sales Pipeline

| Stage | ID |
|-------|-----|
| New Lead | `249f57f7-d296-451c-ace0-a0a04eecbc13` |
| Qualified | `a03eac73-3758-4108-9dfb-15de55cf5509` |
| Proposal Sent | `87a280ab-a8ea-4069-9a6e-8280dd342299` |
| Contract Signed | `0d285ceb-b13f-4edd-a5e0-9f042ae14bdb` |

### Pitched — DO NOT RE-PITCH

| Ref | Company | Status |
|-----|---------|--------|
| FLA-2026-102 | Jacquin & Sons | wf_03 running |
| FLA-2026-103 | Rooftop Roofing | wf_03 running |
| FLA-2026-104 | Complete Air & Heat | wf_03 running |
| FLA-2026-105 | Fitzpatrick Plumbing | wf_03 running |
| FLA-2026-106 | Packard Roofing | wf_03 running |
| FLA-2026-107 | Competitive Air & Heat | deal-hunter pitched |

**Next ref:** `FLA-2026-108`  
**Stripe:** 0/6 paid (last verify) — ~$6K one-time + ~$4K/mo MRR at stake

---

## Open Blockers

### 1. GHL War Room SMS (HIGH)
- Workflow `War Room SMS Alert` **does not exist** in GHL (only wf 01–12)
- Fix: Desktop/Comet creates workflow → paste Workflow ID into `config/war-room-alerts.json`
- See: `docs/deal-machine/SMS-COMET-HANDOFF.md`

### 2. Stripe closes (WATCH)
- `stripe-close-verifier` runs every 30 min on FLA-102–107
- On payment → Contract Signed → `#sold-clients` + war-room celebration

---

## Proposal Standard

Gold standard: `templates/proposals/reliable-roofer-dedicated.html`

6 slides: Cover → Why win → Modeled upside → Revenue tiers → Flux deliverables → Investment CTA

Spec: `config/proposal-template-canonical.json`

---

## Automated Schedule

| Agent | When | Skill |
|-------|------|-------|
| Revenue digest | 6 AM daily | deal-orchestrator digest |
| Deal hunter | 7 AM Mon–Fri | deal-hunter hunt |
| Deal hunter (PSL) | 8 AM Sat | deal-hunter hunt |
| Record auditor | 7 AM daily | deal-orchestrator audit |
| Stripe verifier | Every 30 min | verify_close |
| Client fulfillment | Fri 9 AM | client-fulfillment |

Full: `automation/deal-machine-schedule.json`

---

## Desktop Cursor Handoff (paste in new desktop chat)

```
Load config/flux-web-integrated-context.json and docs/flux-web/INTEGRATED-CONTEXT.md first.
I have local Windows permissions + MCP. Branch: cursor/deal-machine-stripe-ghl-fd95.
Priority: create GHL War Room SMS Alert workflow if still missing.
Then continue deal-hunter / close watch without duplicating cloud work.
```

---

## Cloud Agent Handoff

```
Load flux-web-context skill. Read tracker + integrated context.
Run deal-hunter hunt OR verify_close OR war-room digest as scheduled.
Post to #war-room. Triple-notify leadership. Do not re-pitch FLA-102–106.
```

---

## Config & Skill Map

See `config/flux-web-integrated-context.json` → `config_index`, `skills_index`, `docs_index`.

**Always-on rules:** `.cursor/rules/flux-deal-machine.mdc`, `.cursor/rules/flux-web-integrated.mdc`

---

## Local Files (Desktop Only)

- `C:\Users\jonat\OneDrive\Documents\flux-labs-master-ai-knowledge-file.txt`
- `C:\Users\jonat\OneDrive\Documents\flux-labs-complete-pricing.pdf`
- `C:\Users\jonat\OneDrive\Documents\flux-competitive-breakdown.jsx`

June 2026 pricing in knowledge file wins unless Jonathan overrides in chat.
