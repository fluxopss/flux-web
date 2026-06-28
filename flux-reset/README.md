# flux-reset

`flux-reset` is a packaged chat bundle for **The Reset** / **The Reset Social Club**.

## What this package contains

This folder collects the Reset-related chats that currently exist and packages them into a reusable repo-style bundle.

Current sources collected:

- Slack channel `#ai-master` (`C0BAP014AQ7`)
- Reset website reference: `https://the-reset.com/`

## Included records

The package currently contains these Reset artifacts:

1. `2026-06-24` screenshot request thread for **The Reset**
2. `2026-06-24` local-development status thread noting the site was being worked on as a local desktop app
3. `2026-06-24` standalone screenshot post for `the-reset.com`
4. `2026-06-28` packaging thread requesting that the Reset chats be collected into `flux-reset`
5. `2026-06-28` clarification that the target is **The Reset website** / **The Reset Social Club**

## Files

- `context-bundle.json` - machine-readable export of the collected Reset chats
- `reset-chat-index.json` - manifest, source metadata, and packaged item list
- `FLUX-RESET-PACK.md` - human-readable summary of the Reset chat collection
- `chats/` - chat-by-chat markdown exports

## Important boundary

The current workspace repo is still `flux-web`. This package does **not** turn the whole workspace into The Reset website repo; it packages the Reset-related chat material that currently exists so it can be lifted into a standalone `flux-reset` repository later.
