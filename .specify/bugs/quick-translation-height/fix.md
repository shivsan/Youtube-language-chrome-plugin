# Bug Fix: Enlarge the quick translation reading area

- **Slug**: quick-translation-height
- **Fixed**: 2026-10-25
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

The quick-translation region now reserves six lines instead of three, making normal wrapped captions readable without reintroducing vertical layout movement. Longer exceptional translations retain the existing internal scroll fallback.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `sidepanel.css` | modified | Increased `.translation-text` from `4.44em` to `8.88em`. |
| `tests/sidepanel-layout.test.cjs` | updated test | Requires the stable six-line region and preserves the bounded-overflow contract. |

## Tests Added or Updated

- `tests/sidepanel-layout.test.cjs` — verifies that quick translation has a fixed six-line reading area while both original and translated text retain bounded scrolling.

## Local Verification

- Test-first proof: `node --test tests/sidepanel-layout.test.cjs` failed against the previous `4.44em` height.
- Commands run: `node --test tests/sidepanel-layout.test.cjs` → 3 tests passed after the CSS change.
- Commands run: `npm test` → 24 tests passed; Manifest V3, permissions, CSP, and referenced-file validation passed.
- Manual checks: pending Chrome Canary verification after syncing the tested files into the unpacked extension repository.

## Deviations from Assessment

None.

## Follow-ups

- Verify the enlarged reading region at the normal Canary side-panel width with a wrapped live translation.
