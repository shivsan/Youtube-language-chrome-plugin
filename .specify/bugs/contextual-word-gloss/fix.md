# Bug Fix: Clicked words lose contextual sense

- **Slug**: contextual-word-gloss
- **Fixed**: 2026-10-27
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Clicked-word lookup once again receives the reconstructed subtitle sentence so Ollama can choose the intended sense. The prompt now creates a strict boundary between contextual sense selection and the concise word-level gloss stored in vocabulary.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `ollama-client.js` | modified | Restored bounded sentence context and constrained output to a base-form word gloss with essential particles only. |
| `sidepanel.js` | modified | Restored the reconstructed current passage as input to clicked-word enrichment. |
| `tests/ollama-client.test.cjs` | updated test | Proves `appelliert` and its sentence are sent while the expected meaning remains “to appeal to”. |
| `tests/original-word-selection.test.cjs` | updated test | Proves the side panel forwards current caption context to vocabulary enrichment. |

## Diff Highlights

The model receives separate `WORD` and `SENTENCE CONTEXT` sections. Its instructions explicitly use the sentence only for sense selection and reject sentence-specific subjects, objects, pronouns, auxiliaries, and tense from the saved meaning.

## Tests Added or Updated

- `tests/ollama-client.test.cjs` — locks the contextual-input/word-level-output boundary using `appelliert`.
- `tests/original-word-selection.test.cjs` — locks reconstruction and forwarding of the current caption passage.

## Local Verification

- Commands run: `node --test tests/ollama-client.test.cjs tests/original-word-selection.test.cjs` → 11 tests passed.
- Commands run: `npm test` → 52 tests passed and the Manifest V3 permissions, CSP, loopback URL, and referenced-file validator passed.
- Manual checks: Browser/Ollama reproduction not performed in this run.

## Deviations from Assessment

None.

## Follow-ups

- Reload the unpacked extension and remove/re-add any word whose earlier saved meaning should be regenerated under the corrected contract.
