# Data Model: Translation-First Caption Layout

This feature adds no persisted data and changes no state model. It defines only a presentation relationship among existing current-caption values.

## Presentation Regions

### Primary translation region

- **Content**: Successful quick translation or its loading, paused, and error message
- **Order**: First result in the current card
- **Geometry**: Fixed-height, wrapping, vertically scrollable
- **Emphasis**: Largest and highest-contrast sentence text in the card

### Explanation group

- **Content**: Existing explanation action and optional natural explanation
- **Order**: Immediately after the primary translation region
- **Behavior**: Unchanged; remains learner-triggered

### Original reference region

- **Content**: Existing source caption with CEFR word markup
- **Order**: After a section divider below the explanation group
- **Geometry**: Compact fixed-height, wrapping, vertically scrollable
- **Emphasis**: Smaller and muted relative to the translation

### Vocabulary summary

- **Content**: Existing above-level word chips
- **Order**: Immediately after the original reference region
- **Behavior**: Unchanged and still derived from the source caption

## State Transitions

No state transitions change. Caption updates, translation loading/success/failure, pause/resume, and explanation expansion continue to update their existing elements; only their visual placement and styling differ.

## Validation Rules

- The translation element precedes the original element in document order.
- The explanation action is between the translation and original reference.
- Both text elements retain keyboard focusability and bounded overflow.
- The translation font size is at least 25% larger than the original.
