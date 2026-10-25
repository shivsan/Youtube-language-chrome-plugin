# Quickstart: Verify Vocabulary Word Actions

## Automated verification

1. Run `npm test` from the extension repository.
2. Confirm tests cover important-state migration and toggle, stable ordering, known-word filtering, bounded sanitization, and accessible markup.
3. Confirm Manifest V3, permissions, CSP, sources, and network-scope validation passes.

## Chrome Canary verification

1. Reload **YouTube Language Companion** from `chrome://extensions` and refresh a captioned German YouTube video.
2. Wait until at least two entries appear under **Words to learn**.
3. Activate the empty star on a non-first entry. Confirm it becomes a filled star, reports a pressed state, and moves the word ahead of unstarred entries.
4. Activate the filled star again and confirm only the important state changes.
5. Star a word, close and reopen the side panel, and confirm the star remains.
6. Activate the cross for a word. Confirm it leaves Words to learn and `Reset known (1)` appears or increments.
7. Continue until the same word appears in a later caption and confirm it is not re-added to Words to learn, while caption highlighting may still identify it as above the chosen CEFR level.
8. Close and reopen the panel and confirm the crossed word remains absent.
9. Activate **Reset known** and confirm its control disappears while existing saved learning words remain.
10. Encounter the reset word again and confirm it can return to Words to learn.
11. Navigate all star, cross, and reset actions by keyboard and confirm visible focus and accurate accessible names.
