# Research: Translation-First Caption Layout

## Decision 1: Put the translation first in document order

**Decision**: Place the quick translation immediately after the current-card heading and before the explanation action, original caption, and vocabulary summary.

**Rationale**: The learner opens the panel for natural meaning, and the original subtitle is already visible on YouTube. Matching visual and document order also gives keyboard and assistive-technology users the same priority.

**Alternatives considered**:

- Keep the original first but only enlarge translation: rejected because the duplicate source text still delays the primary result.
- Hide the original entirely: rejected because comparing source wording and CEFR highlighting are core learning features.
- Use a tab switcher: rejected because it adds interaction and hides useful context for a simple hierarchy problem.

## Decision 2: Keep explanation with the translation

**Decision**: Keep the idiom/explanation action and expanded explanation directly after the translation, before the source reference divider.

**Rationale**: The action elaborates on the natural meaning, so grouping it with the translation creates one clear comprehension flow.

**Alternatives considered**:

- Leave the button at the bottom after the original: rejected because it separates the action from the content it explains.
- Put the explanation before the translation: rejected because an optional deep explanation should not precede the immediate answer.

## Decision 3: Use relative typography and bounded regions

**Decision**: Use a 19-pixel, strong, high-contrast translation and a 13-pixel, medium-weight, muted original. Give each a fixed height and local vertical scrolling.

**Rationale**: The 46% font-size difference exceeds the 25% success threshold and makes hierarchy immediately visible. Fixed regions prevent the card from bobbing as speech recognition or translation length changes.

**Alternatives considered**:

- Let either region grow naturally: rejected because the user already reported distracting vertical movement.
- Clamp with ellipsis: rejected because it hides language-learning content with no way to read the rest.

## Decision 4: Add a static source contract test

**Decision**: Test relative element order, semantic class names, bounded-region declarations, and relative font sizing by reading the bundled HTML/CSS.

**Rationale**: The project intentionally has no DOM testing dependency. A small source contract protects the critical layout hierarchy while Chrome Canary verification covers the rendered result.

**Alternatives considered**:

- Add a browser automation dependency: rejected as disproportionate for a static reordering and contrary to the project's dependency-light design.
- Rely only on manual verification: rejected because hierarchy regressions would otherwise be easy to reintroduce.
