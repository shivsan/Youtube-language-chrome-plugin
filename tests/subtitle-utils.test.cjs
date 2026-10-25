const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCueText,
  deduplicateLines,
  cleanYouTubeTitle
} = require("../subtitle-utils.js");

test("normalizes whitespace while preserving caption lines", () => {
  assert.equal(normalizeCueText("  Hello   there\n General\tKenobi "), "Hello there\nGeneral Kenobi");
});

test("removes duplicate rendered caption lines", () => {
  assert.deepEqual(deduplicateLines(["Hello", " Hello ", "World"]), ["Hello", "World"]);
});

test("removes YouTube branding from a document title", () => {
  assert.equal(cleanYouTubeTitle("Example Video - YouTube"), "Example Video");
});
