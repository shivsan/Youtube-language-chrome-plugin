# Quickstart: Verify Translation Record Control

## Automated verification

1. Run `npm test` from the extension repository.
2. Confirm the translation-control state tests pass.
3. Confirm the validator reports Manifest V3, permissions, CSP, and referenced files as valid.

## Chrome Canary verification

1. Open `chrome://extensions` in Canary and reload YouTube Language Companion.
2. Open a YouTube video with captions, then open the extension side panel.
3. Confirm the header control shows a stop square and its tooltip says `Stop live translation`.
4. Wait for a quick translation, then press the control.
5. Confirm the control becomes a red record circle, status says `Paused`, and quick translation says `Translation paused.`.
6. Let captions advance. Confirm original captions, history, and vocabulary continue updating without a new quick translation.
7. Change a language while paused. Confirm the panel stays paused.
8. Use `Explain meaning & idioms`. Confirm a manual explanation can still run.
9. Close and reopen the side panel. Confirm it remains paused.
10. Press the red record button. Confirm the current caption is translated and later captions translate automatically.
11. Confirm the button and surrounding header do not shift between states and the button works from the keyboard.
