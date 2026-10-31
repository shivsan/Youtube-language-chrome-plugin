# UI Contract: Original Word Interaction

## German caption

- Each lexical word is one inline native button.
- Surrounding punctuation, spaces, and line breaks remain text nodes in their original order.
- Each button preserves the visible surface form and exposes its current state:
  - available: “Add {word} to Words to learn”;
  - saved: “{word} is already in Words to learn” with pressed state;
  - known: “{word} is marked known and will not be added”.
- Above-level words retain the existing CEFR emphasis in addition to their interaction state.

## Activation result

- available recognized word: add the dictionary entry and announce “Added {lemma} to Words to learn.”
- available unlisted word: add the visible word with unlisted metadata and announce “Added {word} to Words to learn. Level and meaning are unlisted.”
- saved word: no mutation; announce that it is already saved.
- known word: no mutation; announce that it is marked known.

## Non-German caption

- The Original is plain text and has no word controls or German-learning action claim.

## Layout and security

- Feedback occupies one reserved, bounded line and uses a polite live status.
- Caption-derived values are rendered only as text; no HTML interpretation is allowed.
