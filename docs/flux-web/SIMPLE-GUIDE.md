# Flux Labs — Simple Guide (Jonathan)

**You are not alone. The machine works. You sell.**

---

## The one Slack channel that matters

### Open this every morning:

**`#war-room`** in Slack

That's it. Everything the AI does shows up there — deals, money, who to call, hype.

**Ignore other channels for sales.** The robot only talks in `#war-room` now.

---

## What you do (2 things)

### 1. Read `#war-room` (2 minutes)
- See how much money is on the table
- See which company to call **today**
- Copy the "close script" if you want

### 2. Answer the phone & close
- Deals are already pitched in GHL
- GHL sends follow-up texts/emails automatically
- When they pay → the machine detects it and hypes `#war-room`

**You don't move leads in GHL. You don't write emails. You close.**

---

## The 2 setup steps left (one time)

### Step A — Turn on the robot schedule (10 min)

1. Go to **https://cursor.com/automations**
2. Click **New automation**
3. Name it: `Flux Morning Deal Machine`
4. Pick **Scheduled** → every day 6 AM
5. Pick repo: **flux-web** → branch **main**
6. Turn on **MCP** and **Slack**
7. Paste the big prompt from: `automation/AUTOMATION-PROMPTS.md` (in GitHub)
8. Click **Save** and **On**

Repeat for `Flux Stripe Close Verifier` (every 30 min) — same page, second prompt.

**Can't find the prompt?** Ask Cursor Desktop: `Show me automation/AUTOMATION-PROMPTS.md from flux-web main`

### Step B — Text alerts (15 min, optional but good)

1. Open **GoHighLevel** in your browser
2. Automation → Workflows → Create
3. Name: `War Room SMS Alert`
4. Trigger: **Contact Added to Workflow**
5. Action: **Send SMS** with `{{contact.notes}}`
6. Publish → copy the ID → tell Cursor: "Here's the workflow ID: ___"

Until then you still get **email + #war-room**.

---

## Your phone checklist

| Check | Where |
|-------|-------|
| Money on the table? | `#war-room` |
| Who to call today? | `#war-room` (TODAY'S KILL) |
| Did someone pay? | `#war-room` 🏆 post |
| Emails working? | Your inbox from Flux |
| Texts working? | After Step B |

---

## When something breaks

Open **Desktop Cursor**, say:

```
Load flux-web-context. Something broke — [describe in plain English]
```

Examples:
- "I'm not seeing war-room posts"
- "A deal paid but nothing happened"
- "I want more roofing leads"

---

## Money on the table right now

- **6 deals pitched** (FLA-102 through 107)
- **~$6,000** one-time + **~$4,000/month** if they all sign
- **53+ leads** warming in GHL

**The pipeline is full. `#war-room` is the scoreboard. Go get paid.**
