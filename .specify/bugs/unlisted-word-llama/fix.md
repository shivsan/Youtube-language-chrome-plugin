# Bug Fix: Enrich unlisted words with local Llama

- **Slug**: unlisted-word-llama
- **Fixed**: 2026-10-26
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Unlisted German words are now saved immediately and enriched asynchronously through the loopback Ollama 3B model. Validated CEFR and meaning metadata replaces the unlisted fallback when the request succeeds, while local-model failures leave the saved word intact and honestly unlisted.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `ollama-client.js` | modified | Added a bounded vocabulary request and strict parsing of A1–C2 JSON metadata. |
| `sidepanel.js` | modified | Starts non-blocking enrichment after save or a retry click on a legacy unlisted entry, deduplicates in-flight lookups, and persists results only for an entry that still exists. |
| `tests/ollama-client.test.cjs` | updated tests | Covers model selection, loopback endpoint, prompt context, valid normalization, and invalid output rejection. |
| `tests/original-word-selection.test.cjs` | updated tests | Covers asynchronous invocation, request deduplication, persistence, and failure fallback. |

## Diff Highlights

- `enrichGermanWordWithOllama()` uses `llama3.2:3b` with bounded word and subtitle inputs and accepts only a validated CEFR level, meaning, and short part of speech.
- `enrichUnlistedWord()` runs outside the vocabulary write queue, then joins the queue only for the small local-storage update.
- The completed request checks that the saved entry still exists and remains unlisted before updating it, so removal or a newer result wins.
- Clicking an unlisted word saved by an older extension version now retries enrichment, and the Original-word tooltip reflects successful saved metadata.

## Tests Added or Updated

- `tests/ollama-client.test.cjs` — proves an unlisted compound is sent to the fast local model and valid JSON is normalized.
- `tests/ollama-client.test.cjs` — proves invalid CEFR output is rejected rather than stored.
- `tests/original-word-selection.test.cjs` — pins the asynchronous lookup, in-flight deduplication, safe update, persistence, and fallback message.

## Local Verification

- Commands run: `node --test tests/ollama-client.test.cjs tests/original-word-selection.test.cjs` → 11 tests passed.
- Commands run: `npm test` → 52 tests passed; Manifest V3, permissions, CSP, and 10 referenced files validated.
- Commands run: `git diff --check` → passed with no whitespace errors.
- Manual checks: Chrome Canary saved `wortwörtlich` immediately, remained responsive during the local request, then updated the entry to `~B1 — in a literal or strict sense`. A direct live lookup resolved `Linksextreme` to `~B1 — Left-wing extremists` in about 2.7 seconds.

## Deviations from Assessment

None.

## Follow-ups

- Reload the unpacked extension in Chrome Canary and click an unlisted German word while Ollama and `llama3.2:3b` are running to verify model-specific latency and output quality on-device.
