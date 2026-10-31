const test = require("node:test");
const assert = require("node:assert/strict");
const {
  OLLAMA_BASE_URL,
  OLLAMA_TRANSLATION_MODEL,
  OLLAMA_EXPLANATION_MODEL,
  translateWithOllama,
  explainWithOllama,
  enrichGermanWordWithOllama
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
  assert.equal(OLLAMA_TRANSLATION_MODEL, "llama3.2:3b");
  assert.equal(body.model, OLLAMA_TRANSLATION_MODEL);
  assert.equal(body.options.num_predict, 180);
  assert.match(body.messages[1].content, /complete German subtitle passage into English/);
  assert.match(body.messages[0].content, /word-for-word calques/);
  assert.match(body.messages[1].content, /Das ist nicht mein Bier/);
  assert.doesNotMatch(body.messages[1].content, /RECENT SUBTITLE PASSAGE/);
  assert.equal(translation, "That's none of my business.");
});

test("sends a bounded explanation request only to loopback Ollama", async () => {
  let request;
  const explanation = await explainWithOllama(
    {
      caption: "Das ist nicht mein Bier.",
      context: "Du kümmerst dich darum. Das ist nicht mein Bier.",
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
  assert.equal(OLLAMA_EXPLANATION_MODEL, "llama3.1:8b");
  assert.equal(body.model, OLLAMA_EXPLANATION_MODEL);
  assert.equal(body.stream, false);
  assert.equal(body.options.num_predict, 220);
  assert.match(body.messages[0].content, /sarcasm/i);
  assert.match(body.messages[0].content, /uncertain/i);
  assert.match(body.messages[0].content, /positive wording follows clearly negative material/i);
  assert.match(body.messages[1].content, /compare its emotional polarity/i);
  assert.doesNotMatch(body.messages[0].content, /Assume a caption may contain/);
  assert.match(body.messages[1].content, /Das ist nicht mein Bier/);
  assert.match(body.messages[1].content, /RECENT SUBTITLE PASSAGE/);
  assert.match(body.messages[1].content, /Du kümmerst dich darum/);
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
    /llama3\.1:8b model is not installed yet/
  );
});

test("reports the missing translation model independently", async () => {
  await assert.rejects(
    translateWithOllama(
      {
        text: "Hallo",
        sourceLanguage: "German",
        targetLanguage: "English"
      },
      async () => ({
        ok: false,
        status: 404,
        async text() {
          return "model not found";
        }
      })
    ),
    /llama3\.2:3b model is not installed yet/
  );
});

test("uses sentence context to choose a word sense but returns a dictionary gloss", async () => {
  let request;
  const metadata = await enrichGermanWordWithOllama(
    {
      word: "appelliert",
      context: "Bitte sag mir, dass du jetzt an meine Menschlichkeit appelliert hast.",
      targetLanguage: "English"
    },
    async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        async json() {
          return {
            message: {
              content:
                '```json\n{"level":"b2","meaning":"to appeal to","partOfSpeech":"verb"}\n```'
            }
          };
        }
      };
    }
  );

  const body = JSON.parse(request.options.body);
  assert.equal(request.url, `${OLLAMA_BASE_URL}/api/chat`);
  assert.equal(body.model, OLLAMA_TRANSLATION_MODEL);
  assert.equal(body.options.temperature, 0);
  assert.equal(body.options.num_predict, 100);
  assert.match(body.messages[0].content, /CEFR level from A1, A2, B1, B2, C1, or C2/);
  assert.match(body.messages[0].content, /dictionary-style meaning/);
  assert.match(body.messages[0].content, /Use the sentence only to choose the intended sense/);
  assert.match(body.messages[0].content, /never translate or paraphrase the surrounding phrase or sentence/);
  assert.match(body.messages[0].content, /infinitive-style gloss/);
  assert.match(body.messages[0].content, /use 'to appeal to', not 'has appealed to someone\'s humanity'/);
  assert.match(body.messages[0].content, /Return only one JSON object/);
  assert.match(body.messages[1].content, /WORD:\nappelliert/);
  assert.match(body.messages[1].content, /SENTENCE CONTEXT:/);
  assert.match(body.messages[1].content, /an meine Menschlichkeit appelliert/);
  assert.deepEqual(metadata, {
    level: "B2",
    meaning: "to appeal to",
    partOfSpeech: "verb"
  });
});

test("rejects invalid local vocabulary metadata", async () => {
  await assert.rejects(
    enrichGermanWordWithOllama(
      { word: "Linksextreme" },
      async () => ({
        ok: true,
        async json() {
          return {
            message: {
              content: '{"level":"expert","meaning":"left-wing extremists","partOfSpeech":"noun"}'
            }
          };
        }
      })
    ),
    /invalid vocabulary metadata/
  );
});
