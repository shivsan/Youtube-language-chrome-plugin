# Verification: Vocabulary Word Actions

**Date**: 2026-10-25

## Automated evidence

- `npm test`: **PASS** — 23 tests passed.
- Manifest V3, referenced-source, permission, CSP, and network-scope validator: **PASS**.
- `git diff --check`: **PASS** — no whitespace errors were reported.
- New unit coverage proves:
  - importance toggles without losing encounter metadata;
  - important words sort ahead of unstarred words and survive the 500-entry cap;
  - new saved words migrate to `important: false`;
  - known words are filtered before automatic collection;
  - known keys are validated, deduplicated, and capped.
- New source-contract coverage proves word-specific accessible labels, star pressed state, reset-known markup, and compact action styling exist.

## Security and privacy review

- No permission, host, content-security-policy, dependency, or remote-network change.
- The only new retained data is a Boolean on an existing saved word and at most 500 validated normalized word keys.
- Learner words are rendered through `textContent` and interpolated only into text attributes; they are not interpreted as HTML.
- Word actions use the existing serialized vocabulary write queue, avoiding overlapping local-storage updates.
- Older saved entries receive a non-destructive `important: false` default.

## Chrome Canary evidence

**PARTIAL PASS**:

- Reloaded the unpacked extension from its existing repository path.
- Confirmed three existing learning cards render distinct empty-star toggles and word-specific **Mark … as known** controls without overflowing the side panel.
- Starred a non-first word and confirmed the filled star reported a pressed state and the word moved above unstarred entries.
- Closed and reopened the side panel and confirmed the important state and ordering persisted.
- Unstarred the word and confirmed its original newest-seen ordering returned, leaving the user's saved vocabulary unchanged.

The known-word cross was not activated because doing so would remove one of the user's existing saved words. Its state transformation, suppression, bounds, and accessible control contract are covered by the automated suite. T016 remains open for a future disposable-word end-to-end check, so final convergence remains open as well.
