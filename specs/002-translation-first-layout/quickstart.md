# Quickstart: Verify Translation-First Caption Layout

## Automated verification

1. Run `npm test` from the extension repository.
2. Confirm the layout contract test and all existing behavior tests pass.
3. Confirm Manifest V3, permission, CSP, and source validation passes.

## Chrome Canary verification

1. Open `chrome://extensions` in the same Chrome Canary profile that has the unpacked extension installed.
2. Reload **YouTube Language Companion**.
3. Refresh a YouTube watch page, enable captions, and open the extension side panel.
4. Confirm **Current translation** labels the card and **Quick translation** is the first sentence result.
5. Confirm the translation is visibly larger and brighter than the original caption.
6. Confirm **Explain meaning & idioms** is directly below the translation and before the original reference.
7. Confirm **Original** remains visible below the divider with smaller, muted text and CEFR highlighting intact.
8. Observe several captions of different lengths. Confirm neither text region changes height and long text scrolls inside its own region.
9. Use the keyboard to focus both text regions and confirm a visible focus outline.
10. Resize the panel to its narrowest practical width and confirm there is no horizontal scrolling.
11. Pause and resume translation with the record/stop control and confirm the status message stays in the primary translation region.
