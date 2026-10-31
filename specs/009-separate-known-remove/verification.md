# Verification: Separate Known and Remove Actions

## Automated

- TDD red: the focused contracts failed against the previous cross-only known action and missing remove-only path.
- TDD green: `node --test tests/sidepanel-layout.test.cjs tests/known-word-tabs.test.cjs` passed all 12 focused tests.
- Regression: `npm test` passed all 43 tests and the extension validator.
- Syntax: `node --check sidepanel.js` passed.
- Validator: `Validated Manifest V3, permissions, CSP, and 10 referenced files.`
- Repository whitespace check: `git diff --check` passed in the Git checkout after the source sync.

## Chrome Canary

- Reloaded the unpacked extension from `~/porgramming/YouTube Language plugin` and reloaded the YouTube test page.
- Confirmed each learning card visibly fits three distinct controls: importance star, known tick, and remove cross.
- Confirmed accessibility exposes word-specific `Mark <word> as known` and `Remove <word> from Words to learn` buttons.
- Added the disposable unlisted word `diesen` from Original, producing baseline counts of 21 Words to learn and 11 Known.
- Activated its tick and confirmed the counts changed to 20/12, Original reported it as known, and it appeared in the Known tab.
- Used Learn again to restore `diesen` to Words to learn at 21/11.
- Activated its cross and confirmed the counts changed to 20/11, Original offered it for addition again, and Known remained unchanged.
- The test word was therefore removed and the user's original 20/11 vocabulary counts were restored.

## Convergence

- Reconciled all 8 functional requirements and 4 success criteria against source contracts, persistence paths, the regression suite, validator, and Canary evidence.
- Reconciled all 10 implementation tasks as complete.
- Confirmed no permission, origin, dependency, storage-schema, or network behavior changed.
- No unresolved specification, plan, implementation, or evidence findings remain.
