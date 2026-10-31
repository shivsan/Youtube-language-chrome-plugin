# Bug Assessment: Clicked words lose contextual sense

- **Slug**: contextual-word-gloss
- **Created**: 2026-10-27
- **Source**: pasted clarification following `dictionary-word-meaning`
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The learner clarified that clicked-word lookup should still use the subtitle sentence because German words can have several meanings. The saved result must reflect the word's meaning in that sentence while remaining a concise word-level gloss rather than a translation of the complete phrase.

## Symptom

The preceding fix removed subtitle context entirely from clicked-word lookup. This prevents phrase-level translations, but it also prevents Ollama from choosing the intended sense of an ambiguous German word.

## Reproduction

1. Display a German subtitle containing a word with multiple possible meanings.
2. Click the word in **Original** and allow Ollama to enrich it.
3. Observe from the request contract that Ollama receives only the isolated token and cannot use the current subtitle sentence to select its intended sense.

## Suspected Code Paths

- `ollama-client.js:127-150` — `enrichGermanWordWithOllama` accepts only the word and target language and sends no sentence.
- `sidepanel.js:781-843` — clicked-word handling no longer reconstructs or forwards the current caption passage.
- `tests/ollama-client.test.cjs:115-155` — the regression contract explicitly requires that no subtitle context be sent.
- `tests/original-word-selection.test.cjs:29-50` — the side-panel contract explicitly rejects a context-bearing enrichment call.

## Root Cause Hypothesis

**High confidence.** The previous remediation conflated preventing phrase-level output with withholding contextual input. The output format can be constrained independently: Ollama can receive the sentence to select a sense while being instructed to return only a reusable gloss of the selected word.

## Proposed Remediation

**Preferred**: Restore a bounded current subtitle passage to clicked-word enrichment. Tell Ollama to use the sentence only to choose the intended sense, then return an infinitive/base-form dictionary gloss for the selected word. Permit essential particles or prepositions such as “to appeal to”, but prohibit subjects, objects, pronouns, auxiliaries, tense, and other sentence-specific details in the saved meaning. Keep the explanation flow unchanged.

**Files likely to change**:

- `ollama-client.js`
- `sidepanel.js`
- `tests/ollama-client.test.cjs`
- `tests/original-word-selection.test.cjs`

**Tests to add or update**:

- Pin that `appelliert` and its subtitle sentence are both included in the request.
- Pin that the prompt uses the sentence only for sense selection and still requires a word-level gloss such as “to appeal to”.
- Pin that clicked-word handling forwards the reconstructed current caption passage.
- Run the focused tests, full regression suite, and extension-security validator.

## Risks & Considerations

- A small local model may still violate prompt instructions occasionally; the prompt must give an explicit positive and negative example.
- Context remains bounded, local, ephemeral, and sent only to loopback Ollama.
- Previously saved vocabulary meanings are not automatically rewritten.
- Translation and explanation prompts must remain unchanged.

## Open Questions

- None.
