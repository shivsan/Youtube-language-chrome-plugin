# Word Actions UI and Storage Contract

## Star control

- One button per saved word.
- Empty star means unstarred; filled star means important.
- Exposes `aria-pressed` and a word-specific accessible name describing the next action.
- Toggling preserves encounter count, timestamps, meaning, level, and cue identifiers.
- Important words sort before unstarred words.

## Known-word cross

- One cross button per saved word.
- Accessible name and tooltip say `Mark <word> as known`.
- Activating removes the entry and records its normalized key in the known-word set.
- Later automatic collection excludes that key.

## Reset known

- Hidden when the known-word set is empty.
- Otherwise labelled `Reset known (N)` where N is the sanitized known-key count.
- Clears only the known-word set and makes those keys eligible for later collection.

## Storage

- Existing key `savedVocabulary` retains its array shape and adds an optional Boolean `important` field.
- New key `knownVocabulary` contains at most 500 validated normalized strings.
- Both keys are stored in `chrome.storage.local` and are inaccessible to content scripts.

## Security and accessibility

- No untrusted string is inserted as HTML.
- Buttons have visible focus states and meaningful non-colour glyphs, names, tooltips, and pressed state.
- No new permission, origin, or network request is introduced.
