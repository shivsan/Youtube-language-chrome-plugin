# UI Contract: Known Word Tabs

## Tab interface

- The vocabulary section contains a `tablist` with `tab` controls for Words to learn and Known.
- Each tab exposes its collection count and controls one `tabpanel`.
- Exactly one tab has `aria-selected="true"`, `tabindex="0"`, and a visible panel.
- Pointer activation selects a tab. ArrowLeft and ArrowRight cycle between tabs; Home selects the first and End selects the last.

## Known list

- Sanitized keys render newest first.
- Bundled metadata is displayed when available.
- Missing CEFR or meaning is explicitly described as unlisted.
- Each entry has a visible Learn again button and an accessible label of the form `Move <word> back to Words to learn`.

## Learn again action

- Success moves one key from Known to Words to learn and creates no duplicate.
- A restored entry is unstarred with one encounter.
- The Known tab remains selected and counts update.
- Failure leaves the word in Known.
- Success and failure are announced in the reserved polite status region.

## Privacy and security

- Both collections remain in existing local extension storage.
- No caption or vocabulary text is sent to a new destination.
- Rendered labels use safe DOM text assignment.
