# flux-reset

`flux-reset` is a packaged snapshot of the reset-chat material that already exists inside this workspace.

## What was collected

This package pulls together the durable chat-memory artifacts that were already tracked in `flux-web`:

- integrated chat memory from `config/flux-web-integrated-context.json`
- human-readable context from `docs/flux-web/INTEGRATED-CONTEXT.md`
- live state from `automation/deal-machine-tracker.json`
- provenance from the git commit timeline that built the current memory layer

## What is inside

- `context-bundle.json` - machine-readable bundle of integrated context plus tracker state
- `reset-chat-index.json` - package manifest, included topics, and source commit timeline
- `FLUX-RESET-PACK.md` - human-readable export of the current reset context

## Important limitation

This repo did **not** contain raw per-chat transcript exports. The durable source that currently exists is the integrated context layer plus the related docs and state files. This package preserves that material without pretending the missing raw transcripts were available.

## Source

- Source repo: `flux-web`
- Source branch at packaging time: `main`
- Source commit at packaging time: `7648a01431c16399d15ca29ed529898b4ddd70f6`

## Next move

If you want `flux-reset` promoted into its own standalone repository later, this folder is now structured to be lifted out directly.
