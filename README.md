# flux-web

Flux Labs website work + **Deal Machine** revenue operating system.

## Deal Machine

Automated deal production: hunt → enrich → qualify → pitch → close → expand.

- **Payments:** Stripe (monthly subscriptions + one-time via website automations)
- **Control plane:** GHL (pipeline, workflows, trials, nurture)
- **Orchestration:** Cursor Cloud Agents + Zapier MCP

### Quick Start

```
Run deal-machine in digest mode
Run deal-hunter for 25 Brevard County HVAC leads
Run deal-machine pitch mode for [email] with Flux Ops Growth
```

### System Files

| Path | Purpose |
|------|---------|
| `config/flux-ops-canonical.json` | Locked IDs, pricing, payment rails |
| `.cursor/skills/deal-machine/` | Executive orchestrator |
| `.cursor/skills/ghl-stripe-close/` | Stripe payment → GHL close → onboard |
| `.cursor/skills/deal-hunter/` | Outbound prospecting |
| `docs/deal-machine/PLAYBOOK.md` | Full operating playbook |
| `automation/deal-machine-schedule.json` | Agent schedule |

### Pipeline (GHL)

```
New Lead → Qualified → Proposal Sent → Contract Signed → In Delivery → Delivered → Active Recurring
```

Every stage transition is automated. Stripe confirms payment. GHL runs trials. Cursor orchestrates.
