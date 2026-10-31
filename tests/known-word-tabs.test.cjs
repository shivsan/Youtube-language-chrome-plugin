const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const html = readFileSync(join(projectRoot, "sidepanel.html"), "utf8");
const css = readFileSync(join(projectRoot, "sidepanel.css"), "utf8");
const script = readFileSync(join(projectRoot, "sidepanel.js"), "utf8");

test("vocabulary uses two accessible tabs and separate panels", () => {
  assert.match(html, /class="vocabulary-tabs"[^>]*role="tablist"/);
  assert.match(html, /id="learn-vocabulary-tab"[^>]*role="tab"[^>]*aria-selected="true"[^>]*aria-controls="learn-vocabulary-panel"/s);
  assert.match(html, /id="known-vocabulary-tab"[^>]*role="tab"[^>]*aria-selected="false"[^>]*aria-controls="known-vocabulary-panel"/s);
  assert.match(html, /id="learn-vocabulary-panel"[^>]*role="tabpanel"[^>]*aria-labelledby="learn-vocabulary-tab"/s);
  assert.match(html, /id="known-vocabulary-panel"[^>]*role="tabpanel"[^>]*aria-labelledby="known-vocabulary-tab"[^>]*hidden/s);
  assert.match(html, /id="learn-vocabulary-count"/);
  assert.match(html, /id="known-vocabulary-count"/);
});

test("known words expose individual Learn again actions instead of bulk reset", () => {
  assert.doesNotMatch(html, /id="reset-known-vocabulary"/);
  assert.doesNotMatch(script, /resetKnownWords/);
  assert.match(script, /learnAgain\.textContent = "Learn again"/);
  assert.match(script, /`Move \$\{word\.lemma\} back to Words to learn`/);
  assert.match(script, /function restoreKnownWord\(key\)/);
  assert.match(script, /removeKnownVocabularyKey\(/);
  assert.match(script, /resolveKnownVocabularyWord\(/);
});

test("tabs support roving keyboard focus and accurate selected state", () => {
  assert.match(script, /case "ArrowLeft":/);
  assert.match(script, /case "ArrowRight":/);
  assert.match(script, /case "Home":/);
  assert.match(script, /case "End":/);
  assert.match(script, /setAttribute\("aria-selected", String\(selected\)\)/);
  assert.match(script, /tabIndex = selected \? 0 : -1/);
});

test("vocabulary feedback and lists remain bounded", () => {
  assert.match(html, /id="vocabulary-action-status"[^>]*role="status"[^>]*aria-live="polite"/s);
  assert.match(css, /\.vocabulary-action-status:empty\s*{[^}]*display:\s*none;/s);
  assert.match(css, /\.vocabulary-list\s*{[^}]*max-height:\s*340px;[^}]*overflow-y:\s*auto;/s);
  assert.match(css, /\.vocabulary-tab\[aria-selected="true"\]\s*{/);
  assert.match(css, /\.learn-again-button\s*{/);
});

test("restoring a known word relies on list movement instead of success copy", () => {
  assert.doesNotMatch(script, /Moved \$\{word\.lemma\} back to Words to learn\./);
  assert.match(script, /showVocabularyActionStatus\("Could not restore that word\. Try again\."\)/);
  assert.match(script, /showVocabularyActionStatus\(\s*"Words to learn is full\./s);
});

test("learning entries separate the known tick from the remove cross", () => {
  assert.match(script, /known\.textContent = "✓"/);
  assert.match(script, /known\.setAttribute\("aria-label", `Mark \$\{entry\.lemma\} as known`\)/);
  assert.match(script, /known\.addEventListener\("click", \(\) => markSavedWordKnown\(entry\.key\)\)/);
  assert.match(script, /const remove = document\.createElement\("button"\)/);
  assert.match(script, /remove\.textContent = "×"/);
  assert.match(script, /remove\.setAttribute\(\s*"aria-label",\s*`Remove \$\{entry\.lemma\} from Words to learn`/s);
  assert.match(script, /remove\.addEventListener\("click", \(\) => removeSavedWord\(entry\.key\)\)/);
  assert.match(script, /function removeSavedWord\(key\)/);
  assert.match(css, /\.vocabulary-known:hover,\s*\.vocabulary-known:focus-visible\s*{[^}]*color:\s*var\(--success\);/s);
  assert.match(css, /\.vocabulary-remove:hover,\s*\.vocabulary-remove:focus-visible\s*{[^}]*color:\s*#ff8990;/s);
});

test("remove persists only the learning list while known persists both lists", () => {
  const knownSource = script.slice(
    script.indexOf("function markSavedWordKnown(key)"),
    script.indexOf("function removeSavedWord(key)")
  );
  const removeSource = script.slice(
    script.indexOf("function removeSavedWord(key)"),
    script.indexOf("function restoreKnownWord(key)")
  );

  assert.match(knownSource, /addKnownVocabularyKey\(/);
  assert.match(knownSource, /chrome\.storage\.local\.set\(\{ savedVocabulary, knownVocabulary \}\)/);
  assert.match(removeSource, /chrome\.storage\.local\.set\(\{ savedVocabulary \}\)/);
  assert.doesNotMatch(removeSource, /knownVocabulary|addKnownVocabularyKey/);
});
