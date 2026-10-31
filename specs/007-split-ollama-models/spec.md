# Feature Specification: Split Ollama Models

**Feature Branch**: `main`

**Created**: 2026-10-25

**Status**: Approved for implementation

**Input**: User description: "Use a 3B Llama model for quick translation and the existing 8B Llama model for explanations."

## User Scenarios & Testing

### User Story 1 - Receive faster quick translations (Priority: P1)

As a learner watching captioned video, I receive automatic quick translations from the smaller local model so the main reading experience responds sooner.

**Why this priority**: Quick translation runs repeatedly and is the extension's primary experience, so its latency matters most.

**Independent Test**: With both local models installed, show a caption and observe that quick translation uses the configured 3B model while remaining local.

**Acceptance Scenarios**:

1. **Given** local Ollama and the 3B model are available, **When** a caption is translated, **Then** the request uses the 3B model.
2. **Given** the 3B model is unavailable, **When** a caption needs translation, **Then** the existing Chrome on-device translation fallback is attempted and the UI identifies the unavailable local translation model.
3. **Given** translation is paused, **When** captions change, **Then** no 3B translation request is started.

---

### User Story 2 - Keep richer explanations (Priority: P1)

As a learner asking about meaning or idioms, I receive the explanation from the larger local model so nuanced language quality is preserved.

**Why this priority**: Explanations are less frequent but require stronger reasoning about idioms, tone, and intended meaning.

**Independent Test**: Request an explanation for a German idiom and observe that the request uses the configured 8B model independently of the translation route.

**Acceptance Scenarios**:

1. **Given** local Ollama and the 8B model are available, **When** Explain meaning & idioms is activated, **Then** the explanation request uses the 8B model.
2. **Given** the 8B model is unavailable, **When** an explanation is requested, **Then** the existing Chrome on-device language-model fallback is attempted without changing the quick-translation route.
3. **Given** either local request fails, **When** an error is shown, **Then** it names the model that failed rather than a generic shared model.

### Edge Cases

- The 3B model may be installed while the 8B model is absent, or vice versa; each feature remains independently routable.
- Loading one model may evict the other from constrained memory; each request still names its required model explicitly.
- A local model can be present but Ollama can be stopped; existing local fallback and error behavior remains in force.
- Rapid caption updates continue to use the existing debounce and stale-request protections.
- Model output remains untrusted text and is never interpreted as markup or instructions.

## Requirements

### Functional Requirements

- **FR-001**: Automatic quick-translation requests MUST use `llama3.2:3b`.
- **FR-002**: Meaning and idiom explanation requests MUST use `llama3.1:8b`.
- **FR-003**: The two routes MUST select their models independently and MUST NOT rely on one shared model setting.
- **FR-004**: A missing-model error MUST identify the specific model requested.
- **FR-005**: Quick translation MUST retain the existing Chrome Translator fallback when the 3B route is unavailable.
- **FR-006**: Explanation MUST retain the existing Chrome LanguageModel fallback when the 8B route is unavailable.
- **FR-007**: Status and setup messages MUST identify the relevant translation or explanation model when naming a model.
- **FR-008**: Existing request bounds, timeouts, loopback-only destination, caption debouncing, pause behavior, and safe text rendering MUST remain unchanged.
- **FR-009**: The feature MUST introduce no new browser permission, host origin, cloud service, JavaScript dependency, or persistent data.

### Key Entities

- **Translation model route**: The local model identifier used only for automatic caption translation.
- **Explanation model route**: The local model identifier used only for requested meaning and idiom explanations.
- **Local model error**: A bounded user-facing error that identifies the model unavailable on the requested route.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Every automated quick-translation request in contract tests selects the 3B model.
- **SC-002**: Every local explanation request in contract tests selects the 8B model.
- **SC-003**: Failure of either model route leaves the other route's configured model unchanged.
- **SC-004**: Existing translation and explanation fallbacks, pause behavior, privacy validation, and full regression suite continue to pass.
- **SC-005**: On the user's device, a warm quick-translation request completes without blocking the side panel and is verified in Chrome Canary.

## Assumptions

- "3B" means `llama3.2:3b`, the smaller model recommended and benchmarked in the preceding discussion.
- "8B" means the extension's existing `llama3.1:8b` model.
- The model split is fixed configuration for now; adding a model-selection setting is outside this feature.
- Model installation is an environment prerequisite, not a browser permission or extension download.
