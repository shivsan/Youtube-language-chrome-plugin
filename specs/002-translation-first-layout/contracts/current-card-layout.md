# Current Card Layout Contract

## Reading order

When current caption content is present, the card exposes this order:

1. Current translation heading and playback time
2. Quick translation label and primary translated text/status region
3. Explain meaning and idioms action
4. Optional natural explanation
5. Section divider
6. Original label and compact source-caption reference
7. Optional above-level vocabulary summary

## Visual hierarchy

- The translated text is the card's largest and highest-contrast sentence text.
- The original caption uses smaller, muted text while remaining legible.
- The original reference never replaces the translation as the primary region, including while translation is loading, paused, or unavailable.

## Geometry and access

- Both text regions have fixed heights, wrap long text, and scroll vertically.
- Neither region introduces horizontal scrolling at the 320-pixel minimum width.
- Both text regions remain keyboard focusable and show visible focus styling.
- Existing element IDs remain stable so caption, translation, and vocabulary behavior is unchanged.

## Privacy and security

This presentation contract adds no data flow, retention, permission, origin, or executable code.
