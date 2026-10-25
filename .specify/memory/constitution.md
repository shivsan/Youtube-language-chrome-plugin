# YouTube Language Companion Constitution

## Core Principles

### I. Specify User Behaviour First

Every feature begins with a Spec Kit specification that describes the learner outcome, user stories, acceptance scenarios, edge cases, and explicit non-goals before implementation details are chosen. Requirements must be observable from the Chrome extension UI or its documented storage and local-service boundaries. Ambiguous behaviour is clarified before planning, and implementation must not silently expand beyond the approved specification.

### II. Local-First Privacy and Least Privilege

Caption text and learning data must remain on the user's device. Local Ollama requests are restricted to `127.0.0.1`; no cloud AI, analytics, transcript export, or unrelated browsing data collection may be introduced. Chrome permissions, host access, retained data, and network destinations must be minimized and named explicitly in the specification and plan. Untrusted caption or model output is rendered as text, never executable markup. New permissions, origins, persistent data, or remote services require an explicit security and privacy review.

### III. Translation Is the Primary Experience

The current caption, natural translation, advanced vocabulary, and idiom explanation take priority over configuration and secondary history. Translation starts automatically when usable captions arrive. Progressive subtitle fragments update the current history item rather than creating one entry per partial phrase. Dynamic content must not cause distracting layout movement; bounded, scrollable regions are preferred when content length changes. Settings remain compact and discoverable without obscuring the translation.

### IV. Evidence Before Completion

Each acceptance criterion must map to automated tests, extension validation, or a documented manual Canary scenario. Bug fixes require a regression test when the affected behaviour can be tested locally. `npm test` and the manifest/security validator must pass before a change is called complete. Browser-dependent behaviour must be verified in Chrome Canary with captions enabled; unperformed checks are reported honestly rather than inferred.

### V. Small, Reviewable, Dependency-Conscious Changes

Keep the Manifest V3 extension in plain HTML, CSS, and JavaScript unless a specification demonstrates that a dependency materially improves correctness or maintainability. Reuse the existing content-script, service-worker, side-panel, and pure-utility boundaries. Make the smallest coherent change that satisfies the specification, avoid unrelated refactors, and keep generated vocabulary data separate from hand-maintained logic. Every new dependency must be justified in the plan and checked for maintenance, licence, and security impact.

## Product and Technical Constraints

- Support YouTube watch and Shorts pages without intercepting media streams or private playback requests.
- Read only captions visibly rendered by YouTube and tolerate YouTube DOM changes without broadening access.
- Prefer Ollama on loopback for translation and explanations; use Chrome's on-device AI only as a local fallback.
- Keep caption history session-scoped. Keep user preferences and saved vocabulary local until the user clears them.
- Treat CEFR levels as estimates and label them honestly; never present heuristic vocabulary ratings as authoritative.
- Maintain a strict extension Content Security Policy, bounded input sizes and timeouts, validated message senders, and `textContent` rendering.
- Preserve accessibility, keyboard usability, readable contrast, and stable panel geometry for every UI change.

## Spec-Driven Workflow

For a new feature or behaviour change:

1. Run `$speckit-specify` and review the user-facing contract.
2. Run `$speckit-clarify` when any user behaviour, privacy boundary, or fallback is ambiguous.
3. Run `$speckit-plan`; record architecture, permissions, storage, security, testing, and migration impact.
4. Run `$speckit-checklist`, then `$speckit-tasks` and `$speckit-analyze` before implementation.
5. Run `$speckit-implement` only after the specification and plan are coherent.
6. Run `$speckit-converge` until all accepted requirements have evidence and the result is converged.

For a reported defect, use `$speckit-bug-assess`, `$speckit-bug-fix`, and `$speckit-bug-test` so diagnosis, remediation, and verification remain separate and reviewable.

Specifications are living contracts while a feature is active. After convergence, retain the complete feature directory as a historical record; later behavioural changes receive a new spec that links to the earlier one.

## Governance

This constitution governs all Spec Kit artifacts and implementation work in this repository. Plans and tasks must identify any intentional exception and explain why it is necessary. Changes that weaken privacy, security, test evidence, or least-privilege access require explicit user approval. Amendments must update this document, record the reason in the relevant specification, and increment the constitution version according to semantic versioning.

**Version**: 1.0.0 | **Ratified**: 2026-10-25 | **Last Amended**: 2026-10-25
