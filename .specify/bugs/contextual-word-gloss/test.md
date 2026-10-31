# Bug Verification: Clicked words lose contextual sense

- **Slug**: contextual-word-gloss
- **Tested**: 2026-10-27
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

Automated verification proves that clicked-word lookup includes the reconstructed subtitle sentence for sense selection while retaining a word-level output contract. The full suite and extension-security checks pass; a real Chrome/Ollama result remains to be checked manually.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Reload extension, remove/re-add `appelliert`, inspect its regenerated meaning | not-run | Requires the user's active Chrome profile, video, and local Ollama process. |
| New / updated tests | `node --test tests/ollama-client.test.cjs tests/original-word-selection.test.cjs` | pass | 11 focused tests passed. |
| Regression suite | `npm test` | pass | 52 tests passed. |
| Extension/security validation | `npm run check` | pass | Manifest V3, permissions, CSP, loopback-only Ollama, and referenced files validated. |

## Output Excerpts

```text
ok 5 - uses sentence context to choose a word sense but returns a dictionary gloss
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

- `llama3.2:3b` can occasionally ignore formatting instructions despite the explicit prompt example.
- Existing saved meanings remain unchanged until their entries are removed and added again.

## Recommendation

Reload the unpacked extension, delete the existing `appelliert` entry, and click it again in the sentence containing “an meine Menschlichkeit appelliert”. The expected saved meaning is a context-selected word gloss such as “to appeal to”, not an isolated unrelated sense and not the complete phrase translation.
