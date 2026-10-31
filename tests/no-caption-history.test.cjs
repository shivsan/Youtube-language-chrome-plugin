const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const background = readFileSync(join(projectRoot, "background.js"), "utf8");
const html = readFileSync(join(projectRoot, "sidepanel.html"), "utf8");
const sidepanel = readFileSync(join(projectRoot, "sidepanel.js"), "utf8");
const ollamaClient = readFileSync(join(projectRoot, "ollama-client.js"), "utf8");

test("retains only the current caption and removes obsolete history storage", () => {
  assert.match(background, /chrome\.storage\.session\.set\(\{ latestCue: cue \}\)/);
  assert.match(background, /chrome\.storage\.session\.remove\("cueHistory"\)/);
  assert.doesNotMatch(background, /mergeCueHistory|MAX_CUES/);
  assert.doesNotMatch(sidepanel, /cueHistory/);
});

test("removes every caption-history surface from the side panel", () => {
  assert.doesNotMatch(html, /Caption history|history-list|clear-history/);
  assert.doesNotMatch(sidepanel, /clearHistory|renderHistory|getPreviousContext/);
});

test("uses bounded in-memory context without restoring persistent caption history", () => {
  assert.match(sidepanel, /createCaptionContext/);
  assert.match(sidepanel, /captionContext\.addCue/);
  assert.match(ollamaClient, /RECENT SUBTITLE PASSAGE/);
  assert.match(sidepanel, /RECENT SUBTITLE PASSAGE/);
  assert.match(sidepanel, /sarcasm, irony/);
  assert.doesNotMatch(background, /captionContext|recentCues|contextWindow/);
  assert.doesNotMatch(sidepanel, /chrome\.storage\.(?:local|session)\.(?:get|set)\([^)]*captionContext/s);
});
