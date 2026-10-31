# Quickstart Verification: Separate Known and Remove Actions

1. Run `npm test` and confirm the UI contracts and validator pass.
2. Reload the unpacked extension in Chrome Canary and reload the YouTube test page.
3. Confirm each Words to learn card shows star, tick, and cross controls without overflow.
4. Activate a disposable word's tick and confirm Words to learn decreases, Known increases, and the word appears in Known.
5. Choose Learn again for that word to restore the starting state.
6. Activate a disposable word's cross and confirm Words to learn decreases while Known does not change.
7. Add the removed word again from Original when available, or record the restored fixture used for the check.
8. Confirm word-specific accessible names and tooltips describe the distinct actions.
