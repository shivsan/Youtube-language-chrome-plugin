const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const html = readFileSync(join(projectRoot, "sidepanel.html"), "utf8");
const css = readFileSync(join(projectRoot, "sidepanel.css"), "utf8");
const script = readFileSync(join(projectRoot, "sidepanel.js"), "utf8");

test("Original exposes a stable polite status for word-selection feedback", () => {
  assert.match(
    html,
    /id="word-action-status"[^>]*class="word-action-status"[^>]*role="status"[^>]*aria-live="polite"/
  );
  assert.match(css, /\.word-action-status\s*{[^}]*height:\s*1\.4em;[^}]*overflow:\s*hidden;/s);
});

test("German Original words are accessible buttons with visible states", () => {
  assert.match(script, /button\.className = "original-word";/);
  assert.match(script, /button\.setAttribute\("aria-pressed", String\(state === "saved"\)\)/);
  assert.match(script, /button\.addEventListener\("click", \(\) => addOriginalWordToVocabulary\(word\)\)/);
  assert.match(css, /\.original-word\s*{/);
  assert.match(css, /\.original-word\.is-saved\s*{/);
  assert.match(css, /\.original-word\.is-known\s*{/);
  assert.match(css, /\.original-word:focus-visible\s*{/);
});

test("word activation has explicit added, saved, known, and local lookup feedback", () => {
  assert.match(script, /Added \$\{word\.lemma\} to Words to learn\./);
  assert.match(script, /Looking up level and meaning locally…/);
  assert.match(script, /void enrichUnlistedWord\(word, context, targetLanguage\)/);
  assert.match(script, /is already in Words to learn\./);
  assert.match(script, /is already saved\. Looking up level and meaning locally…/);
  assert.match(script, /is marked known and will not be added\./);
});

test("unlisted word enrichment is asynchronous, deduplicated, and persisted", () => {
  assert.match(script, /const vocabularyEnrichmentRequests = new Map\(\)/);
  assert.match(script, /vocabularyEnrichmentRequests\.has\(word\.key\)/);
  assert.match(script, /const context = selectCurrentPassage\(captionContext\.snapshot\(\), selectedCue\.text\)/);
  assert.match(script, /enrichGermanWordWithOllama\(\{/);
  assert.match(script, /async function enrichUnlistedWord\(word, context, targetLanguage\)/);
  assert.match(script, /enrichGermanWordWithOllama\(\{\s*word:[^}]*context,/s);
  assert.match(script, /const currentEntry = savedVocabulary\.find\(\(entry\) => entry\.key === word\.key\)/);
  assert.match(script, /if \(!currentEntry \|\| currentEntry\.level !== null\) \{/);
  assert.match(script, /level: metadata\.level/);
  assert.match(script, /await chrome\.storage\.local\.set\(\{ savedVocabulary \}\)/);
  assert.match(script, /remains unlisted\. \$\{readableError\(error\)\}/);
  assert.match(script, /button\.title = savedEntry\?\.level/);
});

test("non-German Original captions remain plain text", () => {
  assert.match(script, /if \(elements\.source\.value !== "de"\) \{\s*elements\.original\.textContent = text;/s);
});
