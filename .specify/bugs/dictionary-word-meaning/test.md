# Bug Verification: Clicked words receive phrase-level meanings

- **Slug**: dictionary-word-meaning
- **Tested**: 2026-10-27
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

Automated verification proves that clicked-word lookup no longer sends subtitle context and now requests a dictionary-style meaning for `appelliert`. No automated regression or security validation failed, but the original Chrome/Ollama interaction was not manually reproduced in this run.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Reload extension, remove/re-add `appelliert`, inspect the local-model meaning | not-run | Requires the user's active Chrome profile, video, and local Ollama process. |
| New / updated tests | `node --test tests/ollama-client.test.cjs tests/original-word-selection.test.cjs` | pass | 11 focused tests passed, including the context-free `appelliert` regression. |
| Regression suite | `npm test` | pass | 52 tests passed. |
| Extension/security validation | `npm run check` | pass | Manifest V3, least-privilege permissions, CSP, loopback-only Ollama, and referenced files validated. |

## Output Excerpts

```text
# pass 11
# fail 0
Validated Manifest V3, permissions, CSP, and 10 referenced files.
```

The earlier full regression run reported:

```text
# pass 52
# fail 0
```

## Residual Risks

- Small local models can still produce an imperfect dictionary definition despite the stricter prompt, so one real Ollama result should be checked.
- The existing saved `appelliert` card retains its old phrase-level meaning until it is removed and added again.

## Recommendation

Reload the unpacked extension, delete the existing `appelliert` entry, then click the word again. Close the bug after confirming the replacement meaning is a word-level gloss such as “to appeal” rather than a translation of “an meine Menschlichkeit appelliert”.
