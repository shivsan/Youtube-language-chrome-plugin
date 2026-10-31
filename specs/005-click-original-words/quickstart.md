# Quickstart: Validate Original Word Selection

## Automated

1. Run `npm test`.
2. Run `git diff --check`.
3. Confirm the validator reports Manifest V3, allowed permissions, strict CSP, and referenced files.

## Chrome Canary

1. Reload the unpacked extension and refresh a YouTube video with German captions.
2. Open the side panel and wait for an Original sentence.
3. Select a word below the configured learner level; confirm it appears once in Words to learn.
4. Select the same word again; confirm no duplicate or encounter increment and read the already-saved feedback.
5. Mark the word known, then select it in Original; confirm it stays absent and the status says it is known.
6. Use Tab and Enter or Space to add another word and confirm visible focus and announced feedback.
7. Observe punctuation and line breaks before and after tokenization.
8. Temporarily change the caption language away from German; confirm Original becomes plain text.
9. Let captions and status messages change; confirm the Original/status area remains bounded without vertical bouncing.

## Expected result

Manual selection works independently of CEFR threshold, known words remain protected, unlisted metadata is honest, no duplicates appear, and all existing translation and vocabulary controls continue to work.
