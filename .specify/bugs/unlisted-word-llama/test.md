# Bug Verification: Unlisted words receive local estimates

- **Slug**: unlisted-word-llama
- **Tested**: 2026-10-26
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The original permanent-unlisted behavior no longer reproduces. Chrome Canary saved an unlisted word immediately, displayed the non-blocking local lookup state, and replaced the entry with a validated CEFR estimate and meaning; all focused and regression checks pass.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Reload unpacked extension in Canary, click unlisted `wortwörtlich` in Original, observe the saved item | pass | Status changed from local lookup to `estimated B1`; item changed to `~B1 — in a literal or strict sense`. |
| Real local model | Call `enrichGermanWordWithOllama()` for `Linksextreme` against `127.0.0.1:11434` | pass | Returned `~B1 — Left-wing extremists` in about 2.7 seconds. |
| New / updated tests | `node --test tests/original-word-selection.test.cjs tests/ollama-client.test.cjs` | pass | 11 tests passed, including invalid-output rejection and legacy-unlisted retry coverage. |
| Regression suite | `npm test` | pass | 52 tests passed and extension validation passed. |
| Manifest / security validation | `npm run check` (via `npm test`) | pass | Manifest V3, permissions, CSP, and 10 referenced files validated. |
| Diff hygiene | `git diff --check` | pass | No whitespace errors. |

## Output Excerpts

```text
# tests 52
# pass 52
# fail 0
Validated Manifest V3, permissions, CSP, and 10 referenced files.
```

```text
Added wortwörtlich to Words to learn. Looking up level and meaning locally…
wortwörtlich: estimated B1. Meaning added by local Llama.
wortwörtlich ~B1 in a literal or strict sense Seen once
```

## Residual Risks

- CEFR levels and meanings produced by Llama remain estimates; the UI intentionally marks levels with `~`.
- Output quality depends on the locally installed `llama3.2:3b` model, though malformed or out-of-range metadata is rejected and left unlisted.
- Existing unlisted entries are enriched when clicked again; the extension does not automatically send every historical saved word to Ollama at startup.

## Recommendation

Close the bug — verified end-to-end in Chrome Canary with the configured local Ollama model.
