# Research: Click Original Words to Learn

## Decision: Make every German lexical token selectable

**Rationale**: The learner chooses what matters; limiting controls to automatically advanced words would fail the direct-save goal and make below-level manual selection impossible.

**Alternatives considered**: Only highlight known dictionary words; add controls only to above-level words; use text selection plus a context menu.

## Decision: Save unlisted words without invented metadata

**Rationale**: The bundled lexicon is intentionally finite. Preserving the visible word with an unlisted level is more useful and honest than rejecting it or guessing a CEFR level and meaning.

**Alternatives considered**: Reject unlisted words; invoke an AI model for metadata; store a guessed level. AI enrichment would add latency and inconsistent data, while guessing violates data honesty.

## Decision: Reuse the existing serialized storage queue

**Rationale**: Automatic advanced-word collection and manual selection can happen together. One queue plus a state check at execution time prevents lost updates and duplicates without new infrastructure.

**Alternatives considered**: Direct independent writes; a second manual queue; a new background message API.

## Decision: Use inline buttons and a reserved live status

**Rationale**: Native buttons provide keyboard behavior and accessible semantics. A reserved polite status gives feedback without making the panel jump.

**Alternatives considered**: Clickable spans; toast overlays; modifying the video page itself.
