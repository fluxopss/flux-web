# Canonical Proposal Template — Gold Standard

**Reference file:** `templates/proposals/reliable-roofer-dedicated.html`  
**Config:** `config/proposal-template-canonical.json`  
**Source:** `reliable_roofer_dedicated.html` (Jonathan upload, 2026-06-26)

This is what a **solid Flux Labs proposal** looks like. All future pitches should follow this structure and design system unless Jonathan explicitly overrides.

---

## Format

- **6-slide fullscreen HTML deck** (not PDF, not Google Slides)
- Dark premium theme, particle effects, glass cards
- Client logo on cover
- Keyboard + dot navigation

---

## Slide Structure (always 6)

| # | Slide | Purpose |
|---|-------|---------|
| 1 | **Cover** | `TURN LOCAL SEARCH INTO MORE {ROOFS/JOBS/CALLS} AND MORE REVENUE` + client logo |
| 2 | **Why {Company} can win** | 4 pillars: Own demand → Convert trust → Lift job value → Track wins |
| 3 | **Modeled upside** | Scenario math: extra calls × close rate × avg job value = monthly upside |
| 4 | **Revenue potential** | Conservative / Base case / Annualized dollar tiers |
| 5 | **What Flux builds** | 6 deliverables: site, local SEO, GBP, trust, lead capture, ROI tracking |
| 6 | **Investment CTA** | "Small spend. Big ceiling. Clear upside." + price + bundle name + thesis |

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#050816` |
| Accent | `#1d9bff` / `#66d9ff` / `#a7f3ff` |
| Display font | Archivo Black |
| Body font | DM Sans |
| Cards | `money-card` — glass, rounded-3xl, stat-glow on numbers |

---

## Personalization Checklist

When generating a new proposal, swap:

- [ ] Company name + logo
- [ ] City + industry services
- [ ] Outcome unit (roofs, calls, jobs, etc.)
- [ ] Scenario inputs (calls/mo, close %, avg ticket)
- [ ] Revenue tiers (conservative / base / annualized)
- [ ] Offer name + price from `config/flux-ops-canonical.json`
- [ ] `fla_contract_ref` in GHL + Stripe metadata

**Keep:** 6-slide structure, dark theme, money-card layout, Flux deliverable categories.

---

## Deal Machine Integration

1. **deal-hunter** pitches score 88+ → assign `fla_contract_ref` → advance GHL to Proposal Sent
2. Generate dedicated HTML deck from this template (copy + customize)
3. Host or attach link in GHL notes / custom field
4. GHL **wf_03** delivers via email/SMS — Cursor does not duplicate outreach
5. Post pitch summary to `#war-room`

---

## Reliable Roofer Reference (example)

- **Offer:** Foundation website + local presence — **$1,600**
- **Modeled upside:** 20 calls/mo × 40% × $8,500 = **$68k/mo**
- **Conservative:** $34k/mo | **Annualized:** $816k

Use this as the quality bar for every B2B pitch.
