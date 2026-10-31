# Verification: Click Original Words to Learn

**Date**: 2026-10-25

## Automated evidence

- Test-first proof: seven focused tests failed before implementation because all-word tokenization, unlisted entries, word-state classification, interactive Original controls, stable feedback, and non-German fallback were absent.
- `npm test`: **PASS** — 31 tests passed.
- Manifest V3, referenced-source, permission, CSP, and network-scope validator: **PASS**.
- Focused regression coverage proves:
  - every lexical token is found while punctuation boundaries are preserved;
  - bundled words resolve metadata and unlisted words retain honest empty metadata;
  - manual unlisted entries are stored without an invented CEFR level;
  - known state takes precedence over saved state;
  - Original exposes keyboard buttons, stable polite feedback, visual states, and non-German plain text;
  - existing caption retention, translation control, Ollama safety, layout, automatic CEFR collection, star, and known-word behavior still pass.

## Security and privacy review

- No new permissions, host access, CSP allowances, dependencies, model calls, or network paths.
- Caption-derived words and feedback are rendered through text nodes and `textContent`; no HTML parsing is introduced.
- Manual vocabulary uses the existing bounded, local-only storage collection and serialized write queue.
- Unlisted metadata is represented as `null`/empty values and labelled honestly rather than inferred remotely.
- Caption retention remains current-session only.

## Chrome Canary evidence

- Reloaded the unpacked extension from `/Users/sivakumar/porgramming/YouTube Language plugin`, closed the cached side panel, and reopened it on a German-captioned YouTube video.
- The Original sentence rendered each German lexical token as an accessible toggle button with its lemma meaning and estimated CEFR metadata exposed to assistive technology.
- Clicking `habe` saved lemma `haben` at A1, displayed `Added haben to Words to learn.`, and changed the vocabulary count from 17 to 18.
- Clicking the same Original token again displayed `haben is already in Words to learn.`; the count remained 18 and the saved entry remained `Seen once`.
- The video was left paused after verification. Known-word blocking, unlisted metadata, keyboard activation, non-German fallback, and stable status geometry remain covered by the focused automated regressions to avoid destructive changes to the user's learning state or settings during the live pass.

## Convergence review

- Specification, plan, tasks, contracts, implementation, tests, README, and live evidence reconcile with no unresolved critical, high, or medium findings.
- All 12 functional requirements and all six success criteria are covered by implemented tasks and verification evidence.
- The implementation introduces no new permission, dependency, retention, or network behavior.
