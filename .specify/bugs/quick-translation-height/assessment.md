# Bug Assessment: Quick translation reading area is too small

- **Slug**: quick-translation-height
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> quick translation section is too small to show all words.

## Symptom

Translations that wrap beyond roughly three lines are clipped inside the primary quick-translation region and require internal scrolling. The primary translation should show a typical complete YouTube caption without destabilizing the rest of the side-panel layout.

## Reproduction

1. Open the extension side panel on a YouTube video with captions enabled.
2. Allow a translation long enough to wrap beyond three lines at the normal side-panel width.
3. Observe that the quick translation is constrained to `4.44em` and the remaining words require scrolling.

## Suspected Code Paths

- `sidepanel.css` — `.translation-text` has a fixed `4.44em` height, which is about three lines at the configured line height.
- `tests/sidepanel-layout.test.cjs` — the layout contract explicitly locks the translation region to the undersized height.

## Root Cause Hypothesis

The fixed reading-region height was deliberately introduced to prevent layout movement, but three lines is too small for common wrapped translations at the side-panel width. Confidence: high.

## Proposed Remediation

**Preferred**: Increase the fixed quick-translation reading region to six lines (`8.88em`). Preserve the existing internal overflow behavior for unusually long translations so caption updates do not make the rest of the panel bounce.

**Alternatives**:
- Allow unlimited auto-height, which would show every possible translation but would reintroduce the distracting layout movement previously reported.
- Dynamically shrink the text, which would reduce readability and make font size unpredictable.

**Files likely to change**:
- `sidepanel.css`
- `tests/sidepanel-layout.test.cjs`

**Tests to add or update**:
- Update the layout regression contract to require a stable six-line quick-translation region while retaining bounded overflow.

## Risks & Considerations

- The larger current card leaves less immediately visible space for settings and vocabulary on short displays.
- Exceptionally long translations may still require scrolling; this is intentional to preserve stable geometry.
- No permission, storage, network, dependency, or data-retention behavior changes.

## Open Questions

- None.
