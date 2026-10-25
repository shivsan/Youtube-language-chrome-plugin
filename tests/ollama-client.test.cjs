const test = require("node:test");
const assert = require("node:assert/strict");
const {
  OLLAMA_BASE_URL,
  OLLAMA_MODEL,
  translateWithOllama,
  explainWithOllama
} = require("../ollama-client.js");

test("translates quoted subtitle text through loopback Ollama", async () => {
  let request;
  const translation = await translateWithOllama(
    {
      text: "Das ist nicht mein Bier.",
      sourceLanguage: "German",
      targetLanguage: "English"
    },
    async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        async json() {
          return { message: { content: "That's none of my business." } };
        }
      };
    }
  );

  const body = JSON.parse(request.options.body);
  assert.equal(request.url, `${OLLAMA_BASE_URL}/api/chat`);
  assert.equal(body.model, OLLAMA_MODEL);
  assert.equal(body.options.num_predict, 180);
  assert.match(body.messages[1].content, /German subtitle into English/);
  assert.match(body.messages[1].content, /Das ist nicht mein Bier/);
  assert.equal(translation, "That's none of my business.");
});

test("sends a bounded explanation request only to loopback Ollama", async () => {
  let request;
  const explanation = await explainWithOllama(
    {
      caption: "Das ist nicht mein Bier.",
      targetLanguage: "English"
    },
    async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        async json() {
          return { message: { content: "It means: That is not my problem." } };
        }
      };
    }
  );

  const body = JSON.parse(request.options.body);
  assert.equal(request.url, `${OLLAMA_BASE_URL}/api/chat`);
  assert.equal(body.model, OLLAMA_MODEL);
  assert.equal(body.stream, false);
  assert.equal(body.options.num_predict, 220);
  assert.match(body.messages[1].content, /Das ist nicht mein Bier/);
  assert.doesNotMatch(body.messages[1].content, /PREVIOUS CONTEXT|previous captions/i);
  assert.equal(explanation, "It means: That is not my problem.");
});

test("reports a missing local model clearly", async () => {
  await assert.rejects(
    explainWithOllama(
      { caption: "Hallo" },
      async () => ({
        ok: false,
        status: 404,
        async text() {
          return "model not found";
        }
      })
    ),
    /model is not installed yet/
  );
});
