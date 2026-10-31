# Bug Assessment: Caption context is missing from translation and explanation

- **Slug**: sarcasm-caption-context
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The local model explained `habe ich immer gerne gesehen` as a sincere expression of enjoyment even though the surrounding captions made the delivery sarcastic. A separate rolling-caption example split `finden, denn in vielen europäischen Ländern brennt` and `Ländern brennt aktuell die Hütte, also wortwörtlich.`, producing the malformed quick translation “Countries are burning the hut, literally.” The requested remedy is a short, ephemeral context window and a prompt that considers idioms, tone, and sarcasm without assuming every sentence is idiomatic.

## Symptom

Quick translation loses grammar and meaning when a YouTube rolling caption starts mid-sentence, while explanations can confidently misclassify sarcastic language as a sincere idiom. Translation and explanation should use a bounded window of recent captions, merge overlap, and express uncertainty when tone depends on unavailable audio or visual signals.

## Reproduction

1. Open the extension on the reported German YouTube video with local Ollama models enabled.
2. At approximately `00:11`, allow the successive caption fragments `finden, denn in vielen europäischen Ländern brennt` and `Ländern brennt aktuell die Hütte, also wortwörtlich.` to reach quick translation.
3. Observe the isolated-fragment result “Countries are burning the hut, literally.” rather than a coherent translation of the reconstructed sentence.
4. Ask for an explanation of `habe ich immer gerne gesehen` after a preceding negative or mocking caption.
5. Observe that the explanation treats the sentence as sincere because preceding discourse is unavailable and the prompt strongly biases the model toward idiom detection.

## Suspected Code Paths

- `sidepanel.js:197-205` — replaces `selectedCue` on every session update without retaining a bounded in-memory context window.
- `sidepanel.js:446-465` — caches and translates only the current cue text.
- `sidepanel.js:515-547` — sends only the current cue to both Ollama and Chrome explanation routes.
- `ollama-client.js:55-106` — translation receives a single text fragment, while the explanation prompt assumes a caption may contain an idiom and tells the model not to settle on a literal reading.
- `subtitle-utils.js:38-43` — recognizes only prefix-growing progressive captions; it does not merge suffix/prefix overlap between rolling caption cues.

## Root Cause Hypothesis

The side panel deliberately removed caption history and now has no transient discourse context at all. Consequently, a rolling fragment is translated as a standalone sentence, and the explanation model cannot compare the current phrase with preceding sentiment. The idiom-first prompt amplifies the problem by encouraging a figurative interpretation even when sarcasm, irony, or a plain literal reading is more likely. Confidence: high.

## Proposed Remediation

**Preferred**: Add a pure caption-context utility that keeps only a small in-memory window while the side panel is open. Replace progressive cue updates, merge suffix/prefix overlap for model input, cap the window by cue count, age, and characters, and clear it on video changes or significant seeks. Use the reconstructed passage for quick translation through both Ollama and Chrome Translator. Supply the reconstructed passage plus the current subtitle to both explanation routes. Rebalance the prompts to evaluate idiom, literal meaning, sarcasm, irony, and uncertainty from the available text instead of presuming an idiom.

Keep only `latestCue` in Chrome session storage; do not render context, restore caption history UI, persist the context window, add permissions, or add network destinations.

**Alternatives**:
- Store recent cues in `chrome.storage.session`, which would survive side-panel closure but would reintroduce retained caption history and is unnecessary for active translation.
- Send the complete transcript, which would improve some discourse judgments but violate data minimization and increase latency.

**Files likely to change**:
- `subtitle-utils.js`
- `sidepanel.html`
- `sidepanel.js`
- `ollama-client.js`
- `tests/subtitle-utils.test.cjs`
- `tests/ollama-client.test.cjs`
- `tests/no-caption-history.test.cjs`
- `README.md`

**Tests to add or update**:
- Merge the reported rolling-caption overlap without duplicating `Ländern brennt`.
- Replace progressive cue updates instead of treating each partial phrase as context.
- Enforce cue-count, age, and character bounds.
- Clear context on video changes and significant seeks.
- Verify Ollama translation and explanation prompts contain bounded reconstructed context and balanced tone guidance.
- Verify Chrome storage still retains only `latestCue` and no visible or persistent caption history is restored.

## Risks & Considerations

- Text alone cannot prove sarcasm; prompts must state uncertainty rather than claim access to facial expression, delivery, or scene context.
- Aggressive overlap matching can incorrectly join unrelated captions, so matching should require meaningful token overlap and remain bounded.
- Translating a reconstructed passage may show slightly more text than the currently visible subtitle, but produces a coherent sentence and remains bounded.
- Context must stay in extension memory and all model calls must remain on-device or loopback.
- No permission, dependency, cloud service, analytics, or persistent storage changes are required.

## Open Questions

- None.
