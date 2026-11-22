# Drafts

Write new career simulations here first, in plain Markdown, before turning them into JSON.

Drafts are **not** loaded by the app or checked by `npm run validate`, so you can write freely.

## Suggested draft format

```md
# <Career name>, e.g. Physiotherapist

Interviewed: <who you spoke to, role, years of experience>
Estimated minutes: 8
Starting meters: energy 70, stress 30, satisfaction 50

## Day 1: <title>
Real talk: "<an exact quote from the professional you interviewed>"

### 9:00 AM: choice
<situation>
- A) <choice text>. Effects: energy -5, stress +10. Tags: people, patience. Sets flag: <flag>. Outcome: <one line>
- B) ...

### 11:30 AM: ai_task
<the task>
Rubric: <what a good answer looks like>
Placeholder: <hint text in the box>

### 4:00 PM: event (requires flag: <flag>)
<what happens>. Effects: stress -10
```

When the draft feels right, convert it to `content/simulations/<id>.json` (see the main README).
