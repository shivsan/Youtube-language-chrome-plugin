# Bug Assessment: Clicked words receive phrase-level meanings

- **Slug**: dictionary-word-meaning
- **Created**: 2026-10-27
- **Source**: pasted text and attached screenshot
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

When the learner clicked `appelliert` in the subtitle “bitte sagt mir dass du jetzt hat meine menschlichkeit appelliert”, the saved vocabulary meaning was “has appealed to someone's humanity”. The learner expects the vocabulary card to define the selected word itself, not translate the surrounding phrase. The screenshot also shows the phrase-level meaning persisted in **Words to learn**.

## Symptom

Clicked-word enrichment uses the subtitle as part of the requested definition, so Ollama can save a translation of the surrounding construction instead of a reusable dictionary-style meaning for the selected word. Contextual interpretation should remain available for subtitle explanations, but clicked vocabulary should receive a concise headword gloss.

## Reproduction

1. Open a German-captioned YouTube video and display a caption containing “an meine Menschlichkeit appelliert”.
2. Click `appelliert` in **Original** so the unlisted word is added and enriched by local Ollama.
3. Observe that **Words to learn** can show “has appealed to someone's humanity” instead of a word-level gloss such as “to appeal; to make an appeal”.

## Suspected Code Paths

- `ollama-client.js:127-153` — `enrichGermanWordWithOllama` explicitly requests a “contextual meaning” and includes the full subtitle passage in the vocabulary prompt.
- `sidepanel.js:781-845` — clicked-word handling reconstructs caption context and passes it into vocabulary enrichment.
- `tests/ollama-client.test.cjs:115-153` — the current contract requires subtitle context to appear in the clicked-word request.
- `tests/original-word-selection.test.cjs:29-48` — the interaction test expects the context-bearing enrichment call.

## Root Cause Hypothesis

**High confidence.** The vocabulary prompt and its caller intentionally provide subtitle context and ask for a contextual meaning. This makes the model behave like a phrase translator even though the result is stored as reusable metadata for one word. The separate explanation flow already owns context-sensitive interpretation, so the two contracts have become conflated.

## Proposed Remediation

**Preferred**: Remove subtitle context from clicked-word enrichment end to end. Prompt the local model to define only the supplied German token with a short dictionary-style gloss; for an inflected verb, require an infinitive-style meaning rather than the surrounding clause. Continue treating the word as untrusted input and leave context-aware subtitle explanation unchanged.

**Files likely to change**:

- `ollama-client.js`
- `sidepanel.js`
- `tests/ollama-client.test.cjs`
- `tests/original-word-selection.test.cjs`

**Tests to add or update**:

- Pin that the clicked-word request contains `appelliert` but no subtitle passage.
- Pin that the vocabulary system prompt requests a dictionary-style word meaning and rejects phrase/clause translation as the contract.
- Pin that the side panel no longer collects or passes caption context for word enrichment.
- Run the complete test and extension-security validation suite.

## Risks & Considerations

- A word with multiple unrelated senses will receive a general dictionary gloss instead of context-based disambiguation; this is intentional for the saved vocabulary contract requested by the learner.
- Previously saved phrase-level meanings are local user data and will not be silently rewritten by this fix.
- Explanation, translation, storage, permissions, and network destinations must remain unchanged.

## Open Questions

- None.
