# Implementation Plan: Split Ollama Models

**Branch**: `main` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

## Summary

Split the existing Ollama client into explicit translation and explanation model routes. Quick translation will request `llama3.2:3b`; explanation will retain `llama3.1:8b`. Preserve loopback-only requests, bounded prompts, timeouts, debouncing, and the existing Chrome fallbacks.

## Technical Context

**Language/Version**: Plain JavaScript supported by Manifest V3 Chrome 138+
**Primary Dependencies**: Existing browser APIs and local Ollama; no new JavaScript dependency
**Storage**: No change
**Testing**: Node built-in test runner, request-body contracts, manifest/security validator, local Ollama, Chrome Canary
**Target Platform**: Desktop Chrome/Canary side panel on YouTube watch and Shorts pages
**Performance Goal**: Preserve non-blocking UI and reduce warm automatic-translation latency relative to the current 8B route
**Constraints**: Loopback-only, bounded prompts/output, current fallbacks, no permission or origin expansion
**Scale/Scope**: One local request per debounced caption; explanations remain user initiated

## Constitution Check

- **Specify User Behaviour First**: PASS — independent route and fallback behavior are explicit.
- **Local-First Privacy and Least Privilege**: PASS — both models remain behind the existing loopback origin.
- **Translation Is the Primary Experience**: PASS — the smaller model is assigned to the repeated primary path.
- **Evidence Before Completion**: PASS — request contracts, full validation, local smoke tests, and Canary are planned.
- **Small, Reviewable Changes**: PASS — only the existing client, side-panel messages, tests, and documentation change.

## Project Structure

```text
ollama-client.js
sidepanel.js
README.md
tests/ollama-client.test.cjs
tests/sidepanel-layout.test.cjs
specs/007-split-ollama-models/
```

## Design

1. Replace the shared model constant with exported translation and explanation model constants.
2. Make the common Ollama request helper accept the required model explicitly, while retaining the same URL, timeout, output bound, streaming mode, and keep-alive behavior.
3. Pass the translation model only from the quick-translation client and the explanation model only from the explanation client.
4. Update side-panel setup, fallback, and in-progress messages to name the route-specific model.
5. Keep Chrome Translator as quick-translation fallback and Chrome LanguageModel as explanation fallback.
6. Extend request-body tests to prove exact routing and prevent regression to a shared model.

## Security, Privacy, and Migration

- No manifest, permission, origin, CSP, persistent storage, or data-retention change.
- Both routes remain restricted to `http://127.0.0.1:11434`.
- Caption text remains untrusted quoted material in the existing system prompts.
- Existing installs need the additional local `llama3.2:3b` model; missing-model handling remains explicit and safe.

## Test Strategy

- Start with failing tests that import both constants and assert the exact request model for each public operation.
- Assert that missing-model messages identify the requested model.
- Run the full Node suite, manifest/security validator, syntax checks, and whitespace checks.
- Smoke-test both installed models directly through loopback Ollama.
- Reload Canary and verify quick translation identifies the 3B local route and explanation identifies the 8B local route.

## Post-Design Constitution Check

All gates remain PASS. No exception is required.
