# Bug Fix: Add bounded caption context for translation and explanation

- **Slug**: sarcasm-caption-context
- **Fixed**: 2026-10-25
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

The side panel now keeps a short, bounded caption window only in memory, merges overlapping rolling-caption fragments, and supplies the resulting text to local translation and explanation engines. Explanation prompts now consider literal meaning, idioms, sarcasm, irony, and uncertainty without presuming that a phrase is idiomatic.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `subtitle-utils.js` | modified | Added overlap reconstruction and an in-memory context window bounded by four cues, 20 seconds, 1,600 characters, and playback continuity. |
| `content.js` | modified | Adds a bounded YouTube video key to each current cue so context resets across video navigation. |
| `background.js` | modified | Validates the optional video key while continuing to store only `latestCue`. |
| `sidepanel.html` | modified | Loads the shared subtitle utility before side-panel logic. |
| `sidepanel.js` | modified | Feeds reconstructed rolling-caption input into translation and bounded recent context into both explanation routes. |
| `ollama-client.js` | modified | Bounds model input and uses balanced, context-aware translation and explanation prompts. |
| `README.md` | modified | Documents the transient context window and unchanged persistence/privacy boundary. |
| `tests/subtitle-utils.test.cjs` | updated tests | Covers overlap, progressive replacement, bounds, video changes, and seeks. |
| `tests/ollama-client.test.cjs` | updated tests | Verifies context-aware prompts and balanced sarcasm/uncertainty guidance. |
| `tests/no-caption-history.test.cjs` | updated tests | Verifies context remains in memory and no persistent or visible caption history returns. |

## Tests Added or Updated

- `tests/subtitle-utils.test.cjs` — reconstructs the reported `Ländern brennt` overlap exactly once and verifies the current translation passage.
- `tests/subtitle-utils.test.cjs` — replaces progressive fragments and enforces cue-count, age, character, video, and seek boundaries.
- `tests/ollama-client.test.cjs` — verifies recent context reaches both local model routes and the explanation prompt handles sarcasm and uncertainty without idiom-first bias.
- `tests/no-caption-history.test.cjs` — locks down the no-persistent-history boundary.

## Local Verification

- Test-first proof: focused tests initially failed because context reconstruction and balanced prompts were not implemented.
- Commands run: `node --test tests/subtitle-utils.test.cjs tests/ollama-client.test.cjs tests/no-caption-history.test.cjs` → 16 tests passed after implementation.
- Commands run: `npm test` → 47 tests passed; Manifest V3, permissions, CSP, and 10 referenced files validated.
- Commands run: `git diff --check` → passed.
- Manual checks: live Chrome Canary reproduction has not been performed in this run.

## Deviations from Assessment

None.

## Follow-ups

- Reload the unpacked extension in Chrome Canary and replay the reported video near `00:11` to validate the live caption DOM sequence and local-model wording.
- Sarcasm detection remains probabilistic when the decisive evidence is vocal delivery, facial expression, or other visual context unavailable to captions.
