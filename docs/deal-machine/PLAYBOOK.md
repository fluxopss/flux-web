# THE DEAL MACHINE

## Flux Labs Revenue Operating System
**Version:** 2026-06-26 | **Payment:** Stripe | **Brain:** GHL | **Muscle:** Cursor

---

## What Changed (Read This First)

| Before | Now |
|--------|-----|
| Square as payment rail | **Stripe** — website automations handle monthly + one-time |
| Manual pipeline movement | **GHL workflows** own trials, nurture, and stage progression |
| Ad-hoc outreach | **Deal Machine** orchestrates hunt → enrich → qualify → pitch → close |
| Cursor as code editor | **Cursor as VP of Revenue** — launches agents that produce deals |

---

## The Money Flow

```
LEAD IN ──→ ENRICH ──→ QUALIFY ──→ PITCH ──→ CLOSE ──→ EXPAND
  │           │           │          │         │          │
  GHL        Apollo      GHL wf-02   GHL wf-03  Stripe    GHL upsell
  intake     score 75+   trial       + Stripe   confirms  + Stripe sub
```

**Every step is automated. Every step is tracked. Every step either makes money or gets killed.**

---

## Daily Operating Rhythm (Zero Manual)

| Time | Agent | Skill | Output |
|------|-------|-------|--------|
| 6:00 AM | Revenue Digest | `deal-machine` digest | Pipeline + Stripe + inbox → #project-update |
| 7:00 AM | Deal Hunter | `deal-hunter` | 25 leads → GHL → top 5 pitched |
| 8:00 AM | Warm Lead Closer | `deal-machine` qualify+pitch | Score 80+ GHL leads get Stripe links |
| On reply | Speed Closer | `deal-machine` pitch | Gmail reply → instant Stripe link + GHL advance |
| On payment | Auto Closer | `ghl-stripe-close` | Stripe paid → GHL Contract Signed → onboard |
| Friday | Expansion | `deal-machine` expand | Delivered clients get upsell Stripe subs |

---

## Deal Quotas

| Metric | Target |
|--------|--------|
| Leads hunted per week | 100 |
| Qualified per week | 30 |
| Pitched per week | 15 |
| Closed per week | 3 |
| Monthly recurring added | $2,000+ MRR |

**3 closes per week at $2,500 avg = $7,500/week = $30,000/month.**

That's not a goal. That's the floor.

---

## Offer Priority Stack (What to Pitch First)

1. **Flux Ops Growth** — $697/mo + $997 setup — recurring, high retention, proves itself in 30 days
2. **Pro Site + GBP** — $2,500 + $299/mo — fastest one-time cash + recurring anchor
3. **Full Stack** — Business Site + SEO + GBP — $4,500 + $898/mo — whale deals
4. **Brand Fusion Pro** — $800/mo minimum — pure recurring lead revenue
5. **Flux Ops Starter** — $397/mo — entry point, upsell to Growth in 60 days

---

## GHL Trial Strategy

GHL workflows ARE the trial. Do not reinvent with manual emails.

| Workflow | Purpose | When to Enroll |
|----------|---------|----------------|
| wf-01 Capture | New lead welcome + intake | Every new lead |
| wf-02 Qualify | Discovery + scoring + trial offer | Score 75+ |
| wf-03 Proposal | Pitch sequence + Stripe link delivery | Proposal Sent stage |
| wf-04 Onboard | Payment confirmed → delivery kickoff | Contract Signed |
| wf-missed-call | Speed-to-lead text-back | Any missed call |

**Trials live inside GHL sequences.** Cursor creates the lead, scores it, generates the Stripe link, and advances the stage. GHL does the talking.

---

## Stripe Integration Points

### Website Automations (Already Running)
- Monthly services → Stripe subscriptions
- One-time projects → Stripe checkout
- Metadata: `fla_contract_ref`, `ghl_contact_email`, `service_type`

### Deal Machine Adds
- Auto-generate Stripe payment links at Proposal Sent
- Webhook: payment success → `ghl-stripe-close` skill
- Subscription created → GHL stage → Active Recurring

### Required Stripe Webhook Events
```
checkout.session.completed
invoice.paid
customer.subscription.created
customer.subscription.updated
```

Route these to GHL stage advancement via Zapier or Cursor agent.

---

## Cursor Agent Commands (Copy-Paste Ready)

```
Run deal-machine in digest mode and post to Slack
```

```
Run deal-hunter for 25 Brevard County HVAC leads, pitch top 5
```

```
Run deal-machine pitch mode for [email] with Flux Ops Growth offer
```

```
Run ghl-stripe-close for FLA-2026-### — payment confirmed
```

```
Run deal-machine hunt mode — find every lead in GHL scored 80+ not yet pitched
```

---

## Files in This System

```
config/flux-ops-canonical.json     ← Single source of truth (IDs, pricing, rails)
.cursor/rules/flux-deal-machine.mdc ← Always-on agent rules
.cursor/skills/deal-machine/        ← Executive orchestrator
.cursor/skills/ghl-stripe-close/    ← Payment → pipeline → onboard
.cursor/skills/deal-hunter/         ← Outbound prospecting engine
automation/deal-machine-schedule.json ← Agent schedule config
automation/deal-machine-tracker.json  ← Run tracking template
docs/deal-machine/PLAYBOOK.md         ← This file
```

---

## Activation Checklist

- [ ] Stripe webhooks wired to GHL stage advancement
- [ ] GHL wf-01 through wf-04 live and tested
- [ ] Deal Machine digest scheduled daily
- [ ] Deal Hunter scheduled weekly (Monday)
- [ ] `#project-update` receiving automated reports
- [ ] `#sold-clients` receiving close notifications
- [ ] First hunt run: 25 leads → 5 pitched → 1 closed

**The machine is built. Turn the key.**
