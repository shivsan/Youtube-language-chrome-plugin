# Quickstart: Verify Caption History Removal

## Automated verification

1. Run `npm test` from the extension repository.
2. Confirm the regression test proves source files contain no active `cueHistory`, history UI, history renderer, or previous-caption prompt block.
3. Confirm Manifest V3, permissions, CSP, referenced files, and network-scope validation passes.

## Chrome Canary verification

1. Reload **YouTube Language Companion** from `chrome://extensions` and refresh a captioned German YouTube video.
2. Open the side panel and confirm the current translation, learning controls, and settings appear.
3. Confirm no **Caption history** heading, previous-caption list, or history **Clear** action appears at the full side-panel width and the minimum supported width.
4. Let several captions play and confirm the absent history section does not reappear.
5. Close and reopen the side panel and confirm only the latest current cue is restored.
6. Request an idiom explanation and confirm it still completes for the current sentence.
7. Confirm star, known-word, level, settings, and pause/resume controls remain usable.
