# Bug Verification: Caption context for translation and explanation

- **Slug**: sarcasm-caption-context
- **Tested**: 2026-10-26
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: pass

## Summary

Automated verification confirms that rolling captions are reconstructed without duplicated overlap, context remains bounded and memory-only, and both local explanation routes receive balanced tone guidance. Live verification in Chrome Canary also confirmed that the explanation uses the complete source behind the visible quick translation plus the preceding negative context, even after YouTube's live caption DOM advances to a trailing fragment.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (algorithmic) | `node --test tests/subtitle-utils.test.cjs` | pass | The exact `Ländern brennt` overlap is merged once into a coherent current passage. |
| Reproduction (live model) | Reload extension and replay `P5XoFHTc590` from `00:11`, pause at `00:22`, then select **Explain meaning & idioms** | pass | `llama3.1:8b` identified the contradiction with `schlimme Bilder` and described the speaker as ironic or sarcastic. |
| New / updated tests | `node --test tests/subtitle-utils.test.cjs tests/ollama-client.test.cjs tests/no-caption-history.test.cjs` | pass | 16 focused tests passed. |
| Regression suite | `npm test` | pass | 49 tests passed. |
| Extension validation | `npm run check` | pass | Manifest V3, permissions, CSP, loopback restriction, and 10 referenced files validated. |
| Whitespace check | `git diff --check` | pass | No whitespace errors. |

## Output Excerpts

```text
# tests 49
# pass 49
# fail 0

Validated Manifest V3, permissions, CSP, and 10 referenced files.
```

The live explanation included:

> The sentiment of this subtitle is positive, contrasting with the preceding mention of "schlimme Bilder" (terrible images). This contradiction suggests that the speaker is being ironic or sarcastic.

## Residual Risks

- Sarcasm inferred from text remains probabilistic when vocal delivery or facial expression carries the decisive signal.
- YouTube may emit different live caption fragments or timing on another playback; the source-selection regression test covers the observed trailing-fragment failure mode.
- The `llama3.2:3b` and `llama3.1:8b` outputs can vary by model version and local runtime settings.

## Recommendation

The defect is verified end-to-end. Keep the bounded context and displayed-translation source-selection tests in the regression suite; text-only sarcasm detection should still be presented as an inference rather than a certainty.
