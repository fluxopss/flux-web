# flux-web

Flux Labs website work + **Deal Machine** revenue operating system.

## Start Here (Every Chat)

**Integrated context from all flux-web chats:**

```
Load flux-web-context skill
```

Or read:
- `config/flux-web-integrated-context.json` — machine state + index
- `docs/flux-web/INTEGRATED-CONTEXT.md` — full narrative

Branch: `cursor/deal-machine-stripe-ghl-fd95` | PR: [#1](https://github.com/fluxopss/flux-web/pull/1)

---

## Deal Machine

Automated deal production: **hunt → enrich → qualify → pitch → close → expand**

- **Payments:** Stripe
- **Control plane:** GHL (pipeline, workflows, trials, nurture)
- **Lead gen:** Cursor `deal-hunter` (Mon–Fri 7 AM)
- **Orchestration:** Cursor Cloud + Desktop + Zapier MCP

### Quick Commands

```
Load flux-web-context and run deal-hunter hunt for 25 Brevard HVAC leads
Run deal-orchestrator digest and post to #war-room
Run verify_close for FLA-2026-102 through 107
```

### System Files

| Path | Purpose |
|------|---------|
| `config/flux-web-integrated-context.json` | **All chats integrated — load first** |
| `config/flux-ops-canonical.json` | Locked IDs, pricing, payment rails |
| `config/lead-gen-config.json` | B2B hunt ICP + batch rules |
| `config/proposal-template-canonical.json` | Gold standard proposal deck |
| `.cursor/skills/flux-web-context/` | Session bootstrap |
| `.cursor/skills/deal-hunter/` | B2B lead generation |
| `.cursor/skills/deal-orchestrator/` | Audit, close, digest |
| `.cursor/skills/war-room-alert/` | Leadership triple-notify |
| `automation/deal-machine-tracker.json` | Live pipeline state |
| `automation/deal-machine-schedule.json` | Agent schedule |
| `docs/flux-web/INTEGRATED-CONTEXT.md` | Integrated chat memory |
| `docs/deal-machine/PLAYBOOK.md` | Operating playbook |

### Slack Routing

| Channel | Use |
|---------|-----|
| `#war-room` | All deal ops |
| `#sold-clients` | Closes only |
| `#project-update` | Engineering only |

### Pipeline (GHL)

```
New Lead → Qualified → Proposal Sent → Contract Signed → In Delivery → Delivered → Active Recurring
```

Every stage transition is automated. Stripe confirms payment. GHL runs trials. Cursor hunts and orchestrates.
