# Verification: Split Ollama Models

## Automated

- TDD red: the focused routing suite initially failed four assertions because the old implementation exported and requested one shared 8B model.
- TDD green: `node --test tests/ollama-client.test.cjs tests/sidepanel-layout.test.cjs` passed all 8 focused tests after independent routing was implemented.
- Regression: `npm test` passed all 39 tests and the extension validator.
- Syntax: `node --check` passed for `ollama-client.js`, `sidepanel.js`, `background.js`, `content.js`, and `subtitle-utils.js`.
- Validator: `npm run check` reported `Validated Manifest V3, permissions, CSP, and 10 referenced files.`
- Repository whitespace: `git diff --check` passed in the real checkout after final sync.

## Local Ollama

- `GET http://127.0.0.1:11434/api/tags` confirmed both `llama3.2:3b` (Q4_K_M, 3.2B) and `llama3.1:8b` (Q4_K_M, 8.0B) are installed.
- Exact quick-translation request to `llama3.2:3b`: HTTP 200 in 2.153 seconds, returning `Today we're going to learn something new.` for `Heute lernen wir etwas Neues.`
- The first 8B idiom smoke test exposed a literal interpretation of `Es ist nicht mein Bier`. The explanation system prompt was strengthened to check the whole phrase for conventional figurative usage before accepting a literal reading, and this behavior is covered by a prompt contract test.
- Exact revised explanation request to `llama3.1:8b`: HTTP 200 in 7.684 seconds, correctly leading with `It's not my problem` / `I'm not responsible for this` and contrasting that meaning with the literal wording.
- Both calls used only `http://127.0.0.1:11434/api/chat`, `stream: false`, the existing 120-second client timeout, bounded contexts and outputs, and `keep_alive: 5m`.

## Chrome Canary

- Reloaded extension `mkbmbjaioiffjdgkafilmdfdincmfcjp` from `~/porgramming/YouTube Language plugin`, then reloaded the existing YouTube page so the updated content script was injected.
- With German captions and English output, Quick translation rendered asynchronously while the panel remained usable.
- Expanded Settings displayed `llama3.2:3b will translate locally; Chrome is the fallback.`
- Activating **Explain meaning & idioms** displayed `Using llama3.1:8b locally through Ollama…` while the request ran, then replaced it with the completed explanation.
- After pausing live translation, the Original caption continued to change while Quick translation remained `Translation paused.` No new quick translation was shown.
- Live translation was re-enabled and produced a new quick translation. The video was left paused and the extension left enabled.

## Convergence

- Reconciled all nine functional requirements and five success criteria against the implementation, routing tests, full regression suite, validator, local Ollama responses, and Canary evidence.
- Both routes have independent constants and exact request-body assertions; model-specific missing-model errors and route-specific UI messages are covered.
- Chrome fallbacks, loopback-only networking, timeout and output bounds, debounce and pause behavior, safe text rendering, permissions, storage, and dependencies remain unchanged.
- Result: 0 critical gaps, 0 unresolved ambiguities, and 0 untraceable requirements. The reviewer-owned `checklists/model-routing.md` remains intentionally unchecked for human review.
