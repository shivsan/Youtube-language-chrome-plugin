# Bug Assessment: Unlisted words are not enriched by local Llama

- **Slug**: unlisted-word-llama
- **Created**: 2026-10-26
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> I still get this: Added linksextreme to Words to learn. Level and meaning are unlisted.

The learner expects a German word that is absent from the bundled CEFR data to receive an estimated level and a useful meaning from the configured local Llama model.

## Symptom

Clicking an unlisted German word in Original saves it, but the item permanently displays `unlisted` and `Meaning unlisted`. The expected behavior is to save immediately, asynchronously ask local Ollama for an estimated CEFR level and concise meaning, and update the saved entry when the local response succeeds.

## Reproduction

1. Open a German-captioned YouTube video with local Ollama available.
2. Click a German word that is not present in `german-cefr-data.js`, such as `Linksextreme`.
3. Observe `Added Linksextreme to Words to learn. Level and meaning are unlisted.` and an unlisted saved entry that is never enriched.

## Suspected Code Paths

- `cefr-utils.js:findGermanWords()` — intentionally emits `level: null` and an empty meaning for words absent from the bundled lexicon.
- `sidepanel.js:addOriginalWordToVocabulary()` — persists that fallback and only reports that metadata is unlisted; it never starts local enrichment.
- `ollama-client.js` — exposes translation and explanation calls, but no bounded, validated vocabulary-enrichment call.
- `tests/original-word-selection.test.cjs` — currently asserts the permanent unlisted feedback instead of asynchronous enrichment.
- `tests/ollama-client.test.cjs` — has no contract test for structured word metadata.

## Root Cause Hypothesis

Confidence: high. The behavior is explicit in the current code: an unknown token is saved with empty metadata and no later code path can replace it. Ollama is used only for subtitle translation and explanation, so its availability does not affect vocabulary entries.

## Proposed Remediation

**Preferred**: Add a dedicated loopback-only Ollama request that asks the fast 3B model for strict JSON containing one CEFR estimate and a concise target-language meaning, validates the model output, and rejects malformed results. When an unlisted word is added, persist and render it immediately, then launch this request without awaiting it in the vocabulary write queue. On success, update only the still-existing saved entry and persist the enriched metadata. Deduplicate concurrent requests by word key. On failure, retain the honest unlisted fallback and show a short local-model error without blocking other panel actions.

Use the recent bounded subtitle passage as context so compounds and inflected forms can be interpreted more accurately. Keep the original clicked spelling as the saved lemma to avoid trusting a model-generated identifier.

**Alternatives**:
- Expand the static CEFR dataset. This remains deterministic but cannot cover productive German compounds and does not satisfy the requested Llama fallback.
- Ask the 8B explanation model. It may improve edge cases but is slower; the existing 3B translation model is the better latency trade-off for a short structured lookup.

**Files likely to change**:
- `ollama-client.js`
- `sidepanel.js`
- `tests/ollama-client.test.cjs`
- `tests/original-word-selection.test.cjs`

**Tests to add or update**:
- Verify the vocabulary request uses only loopback Ollama, the 3B model, bounded context, and constrained generation settings.
- Verify valid JSON is normalized and invalid levels or malformed responses are rejected.
- Verify the side panel starts enrichment asynchronously, deduplicates in-flight lookups, persists successful metadata, and preserves the unlisted fallback on failure.

## Risks & Considerations

- CEFR classifications from an LLM are estimates, so the UI must retain the existing `~` estimate marker.
- Model output is untrusted and must be parsed and allow-listed before storage or display.
- A request can finish after the word is removed or marked known; the update must not recreate it.
- Ollama may be stopped or the model may be missing; failure must not undo the saved word or freeze the panel.
- No new host permission, cloud service, dependency, or persistent caption history should be introduced.

## Open Questions

- None. The existing local-first model choice and UI conventions provide a bounded implementation path.
