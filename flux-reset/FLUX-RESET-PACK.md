# Flux Reset Pack

This is the human-readable export of the reset-chat memory that currently exists in the `flux-web` workspace.

## What was actually available

The repository did not contain raw chat transcript files. The durable records that existed were:

1. the integrated context layer
2. the live deal-machine tracker
3. the git history that assembled those decisions

This pack preserves those sources instead of inventing missing transcript exports.

## Reset topics currently present

### 1. War room automation
- `#war-room` is the operating channel for deal ops
- deal updates and hype are routed there
- `#project-update` is explicitly excluded for deal ops

### 2. Leadership notifications
- Jonathan and Heaven are part of the notification policy
- the integrated memory records Slack, email, and SMS expectations

### 3. SMS delivery blocker
- GHL owns SMS
- the `War Room SMS Alert` workflow is still missing
- Slack and email remain the active fallback

### 4. Ownership boundaries
- Cursor owns B2B lead gen and orchestration
- GHL owns customer communications and stage-triggered workflows
- Website owns Stripe checkout
- Comet/Desktop own UI and browser fallback work

### 5. Lead-gen automation
- `deal-hunter` is the active skill
- schedule recorded: Mon-Fri 7 AM and Saturday St. Lucie run
- the integrated context records `FLA-2026-107` as the first hunt pitched

### 6. Proposal standard
- the proposal standard is the reliable roofer dedicated HTML deck
- the six-slide ROI structure is the locked format

### 7. Desktop vs cloud split
- Desktop is for local Windows files and UI work
- Cloud is for autopilot hunt, audit, and close-watch runs

### 8. Pipeline lock
- `FLA-2026-102` through `FLA-2026-107` are part of the tracked pipeline state
- `FLA-2026-102` through `FLA-2026-106` remain do-not-re-pitch references

## Live state snapshot bundled here

- leads in GHL: 53
- pitched active: 6
- active clients: 12
- deals closed: 1
- one-time potential: 5997
- MRR potential: 3985
- next contract ref: `FLA-2026-108`

## Source files used for this pack

- `config/flux-web-integrated-context.json`
- `docs/flux-web/INTEGRATED-CONTEXT.md`
- `automation/deal-machine-tracker.json`
- git history on `main` through commit `7648a01431c16399d15ca29ed529898b4ddd70f6`

## Output files in this package

- `README.md`
- `reset-chat-index.json`
- `context-bundle.json`

## Practical use

If you want to move this into a dedicated standalone repository named `flux-reset`, this folder now has:

- a package README
- a machine-readable bundle
- a provenance index
- a human-readable export

That gives you a clean handoff point without losing where the material came from.
