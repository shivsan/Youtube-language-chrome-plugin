# Bug Fix: Clicked words receive phrase-level meanings

- **Slug**: dictionary-word-meaning
- **Fixed**: 2026-10-27
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Clicked-word enrichment now sends only the selected German token to Ollama and requests a dictionary-style gloss. Subtitle context remains available to the separate explanation flow but can no longer turn a saved word meaning into a phrase translation.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `ollama-client.js` | modified | Removed caption context from vocabulary enrichment and required a word-only, infinitive-style dictionary gloss. |
| `sidepanel.js` | modified | Stopped reconstructing and passing caption context when enriching a clicked word. |
| `tests/ollama-client.test.cjs` | updated test | Added the `appelliert` regression contract and asserted that no subtitle passage is sent. |
| `tests/original-word-selection.test.cjs` | updated test | Pinned the context-free side-panel call and enrichment signature. |

## Tests Added or Updated

- `tests/ollama-client.test.cjs` — proves `appelliert` is requested as an isolated token with a dictionary-style meaning contract and no sentence context.
- `tests/original-word-selection.test.cjs` — proves clicked-word handling no longer forwards caption context to Ollama enrichment.

## Local Verification

- Commands run: `node --test tests/ollama-client.test.cjs tests/original-word-selection.test.cjs` → 11 tests passed.
- Commands run: `npm test` → 52 tests passed and the Manifest V3 permissions, CSP, loopback URL, and referenced-file validator passed.
- Manual checks: Browser/Ollama reproduction not performed in this run.

## Deviations from Assessment

None.

## Follow-ups

- Reload the unpacked extension and remove/re-add the previously saved `appelliert` entry, because existing locally stored meanings are intentionally not rewritten automatically.
