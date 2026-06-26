# Comet Handoff — Create War Room SMS Workflow in GHL

**Priority:** CRITICAL — Jonathan and Heaven are not receiving War Room texts.

**Owner:** Comet (GHL UI / browser automation)

---

## What to do

1. Open **GoHighLevel → Automation → Workflows**
2. Click **Create Workflow**
3. Name: **`War Room SMS Alert`**
4. **Trigger:** `Contact Added to Workflow`
5. **Actions:**
   - Wait 3 seconds
   - Send SMS to contact:
     ```
     {{contact.first_name}}, War Room: {{contact.notes}}

     Check #war-room in Slack for deal updates.
     -Flux War Room
     ```
   - *(Optional)* Clear contact notes
6. **Publish** the workflow
7. Copy the **Workflow ID** from the URL (or workflow settings)
8. Reply in Slack `#war-room` with: `War Room SMS workflow ID: <paste_id_here>`

---

## Verify contacts have SMS enabled

| Person | GHL Contact | Phone | Check |
|--------|-------------|-------|-------|
| Jonathan | jonathan@fluxlab.agency (`qhGUDsW47iLWg8vscFlZ`) | +17728674562 | SMS DND off |
| Heaven | heaven@fluxlab.agency (`IfYpm9qp5m1NWYBTCpB4`) | +17727754860 | SMS DND off |

In each contact record: **DND → SMS should be OFF** for internal alerts.

---

## Manual test after publish

1. Open Jonathan's contact in GHL
2. Manually enroll in `War Room SMS Alert` workflow
3. Confirm SMS arrives on 772-867-4562
4. Repeat for Heaven on 772-775-4860

---

## Do NOT

- Reuse customer workflows (01–12) for internal alerts
- Use tag trigger `war_room_alert_ping` — Zapier cannot re-fire reliably
- Touch pitched batch FLA-2026-102 through 106
