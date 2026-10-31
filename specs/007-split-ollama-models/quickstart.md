# Quickstart Verification: Split Ollama Models

1. Ensure Ollama is running and both `llama3.2:3b` and `llama3.1:8b` are installed.
2. Run `npm test` and confirm the routing contracts and extension validator pass.
3. Send one short translation request through the public translation client and confirm Ollama reports `llama3.2:3b`.
4. Send one explanation request through the public explanation client and confirm Ollama reports `llama3.1:8b`.
5. Reload the unpacked extension in Chrome Canary.
6. Open a YouTube video with German captions and confirm quick translation completes through local Llama with the 3B model named in setup status.
7. Select Explain meaning & idioms and confirm the progress message names the 8B model and a natural explanation appears.
8. Pause translation and confirm caption changes do not start new quick translations.
9. Confirm the manifest permissions, loopback origin, and stable side-panel layout are unchanged.
