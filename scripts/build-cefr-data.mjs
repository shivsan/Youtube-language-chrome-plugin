import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error("Usage: node scripts/build-cefr-data.mjs /path/to/german_vocab_a1_c2.json");
}

const source = JSON.parse(await readFile(resolve(inputPath), "utf8"));
const levels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

function wordsFromField(value) {
  return typeof value === "string"
    ? value.match(/[\p{L}\p{M}]+(?:[-’'][\p{L}\p{M}]+)*/gu) || []
    : [];
}

function conjugatedForms(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value.split("|").flatMap((rawSegment) => {
    const segment = rawSegment.trim();
    const isPastForm = /^(?:Prät\.|Perf\.)/u.test(segment);
    const withoutLabel = segment.replace(/^(?:Prät\.|Perf\.)\s*/u, "");
    const withoutPronoun = withoutLabel.replace(
      /^(?:ich|du|er\/sie\/es|wir|ihr|sie\/Sie)\s+/u,
      ""
    );
    const words = wordsFromField(withoutPronoun);
    if (words.length === 0) {
      return [];
    }
    return [isPastForm ? words.at(-1) : words[0]];
  });
}

const rows = [];
for (const entry of source.words || []) {
  const lemma = entry.word?.trim();
  if (!lemma || /\s/u.test(lemma) || !levels.has(entry.level)) {
    continue;
  }

  const forms = new Set([
    ...wordsFromField(entry.plural),
    ...wordsFromField(entry.variants),
    ...conjugatedForms(entry.conjugation)
  ]);
  forms.delete(lemma);
  rows.push([
    lemma,
    entry.level,
    entry.english || "",
    entry.pos || "",
    [...forms]
  ]);
}

const serializedRows = rows.map((row) => `  ${JSON.stringify(row)}`).join(",\n");
const output = `/*
 * Generated vocabulary data for personal, non-commercial language study.
 * Source: Deutsch Karten commit 4f1484f42db816c690013e9e3d68c8a59da48aa8.
 * See THIRD_PARTY_NOTICES.md for attribution and licence terms.
 */
(function exposeGermanCefrData(root) {
  root.GermanCefrData = Object.freeze([
${serializedRows}
  ]);
})(globalThis);
`;

await writeFile("cefr-german-data.js", output, "utf8");
console.log(`Generated ${rows.length} German CEFR entries.`);
