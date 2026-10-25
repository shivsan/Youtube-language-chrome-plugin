const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCueText,
  deduplicateLines,
  cleanYouTubeTitle,
  isProgressiveCue
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

test("recognizes progressively rendered caption text", () => {
  assert.equal(isProgressiveCue("I", "I am"), true);
  assert.equal(isProgressiveCue("I am", "I am Siva"), true);
  assert.equal(isProgressiveCue("I am\nSiva", "I am Siva today"), true);
});

test("distinguishes a new caption from a growing caption", () => {
  assert.equal(isProgressiveCue("I am Siva", "Nice to meet you"), false);
  assert.equal(isProgressiveCue("", "Nice to meet you"), false);
});
