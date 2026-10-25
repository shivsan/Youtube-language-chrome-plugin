# Research: Translation Record Control

## Decision 1: Persist the mode in session storage

**Decision**: Store `translationEnabled` in `chrome.storage.session`, treating a missing value as `true`.

**Rationale**: This preserves a learner's pause choice while the side panel is reopened but restores automatic translation after Chrome exits, matching the requested temporary control and the existing session-scoped caption history.

**Alternatives considered**:

- In-memory state: rejected because closing the side panel would unexpectedly resume translation.
- Local storage: rejected because a pause would survive browser restarts and could make translation appear permanently broken.

## Decision 2: Gate requests and invalidate results instead of adding transport cancellation

**Decision**: Clear pending debounce timers, destroy the current browser fallback when possible, and advance lifecycle/result sequence values when pausing. All request entry points check the active mode, and late results are ignored.

**Rationale**: Chrome model calls and the current Ollama helper do not share one cancellation contract. Request gating plus stale-result invalidation produces consistent UI behavior without broadening the networking layer or adding dependencies.

**Alternatives considered**:

- Add `AbortSignal` support throughout Ollama and Chrome translation: rejected for this feature because Chrome model cancellation is not equivalent and the extra refactor is unnecessary to satisfy the user-visible contract.
- Only hide translation output: rejected because local model work would continue while the learner believes translation has stopped.

## Decision 3: Use a fixed-size semantic button with a CSS-drawn icon

**Decision**: Use a native `<button>` with a 34-by-34-pixel box. CSS draws a white stop square in active mode and a red circle in paused mode. The accessible name and tooltip describe the next action.

**Rationale**: The native button supplies keyboard behavior, a fixed box prevents layout movement, and shape plus label avoids relying on red alone.

**Alternatives considered**:

- Text button: rejected because it takes focus away from translations and changes width between states.
- Unicode symbols: rejected because glyph appearance and alignment vary across operating systems and fonts.

## Decision 4: Keep manual explanations independent

**Decision**: The toggle gates only automatic quick translations. `Explain meaning & idioms` remains available while paused.

**Rationale**: The explanation is an explicit learner action and a core use case, whereas the control is intended to stop continuously triggered automatic work.

## Decision 5: Add a pure utility for testable state behavior

**Decision**: Add `translation-control.js` with functions that derive the control presentation and decide whether automatic translation may start.

**Rationale**: The project has no DOM test dependency. A small pure boundary provides meaningful automated coverage and follows existing project structure without adding a package.
