import { readFile, access } from "node:fs/promises";
import { Script } from "node:vm";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const referencedFiles = [
  manifest.background.service_worker,
  manifest.side_panel.default_path,
  ...manifest.content_scripts.flatMap((entry) => entry.js),
  "cefr-german-data.js",
  "cefr-utils.js",
  "ollama-client.js",
  "translation-control.js",
  "sidepanel.css",
  "sidepanel.js"
];

for (const file of referencedFiles) {
  await access(file);
}

for (const file of referencedFiles.filter((file) => file.endsWith(".js"))) {
  const source = await readFile(file, "utf8");
  new Script(source, { filename: file });
}

if (manifest.manifest_version !== 3) {
  throw new Error("The extension must use Manifest V3.");
}

const allowedPermissions = new Set(["sidePanel", "storage"]);
for (const permission of manifest.permissions || []) {
  if (!allowedPermissions.has(permission)) {
    throw new Error(`Unexpected extension permission: ${permission}`);
  }
}

const allowedHostPermissions = new Set(["http://127.0.0.1:11434/*"]);
for (const permission of manifest.host_permissions || []) {
  if (!allowedHostPermissions.has(permission)) {
    throw new Error(`Unexpected host permission: ${permission}`);
  }
}
if ((manifest.host_permissions || []).length !== allowedHostPermissions.size) {
  throw new Error("The only allowed host permission is loopback Ollama on port 11434.");
}

const allowedMatches = new Set([
  "https://www.youtube.com/watch*",
  "https://www.youtube.com/shorts/*"
]);
for (const entry of manifest.content_scripts) {
  if (entry.world !== "ISOLATED") {
    throw new Error("Every content script must explicitly use the isolated world.");
  }
  for (const match of entry.matches) {
    if (!allowedMatches.has(match)) {
      throw new Error(`Unexpected content-script origin: ${match}`);
    }
  }
}

const extensionPolicy = manifest.content_security_policy?.extension_pages || "";
if (!extensionPolicy.includes("script-src 'self'") || !extensionPolicy.includes("object-src 'none'")) {
  throw new Error("The extension page Content Security Policy is not strict enough.");
}

const forbiddenSourcePatterns = [
  [/\b(?:eval|Function)\s*\(/, "dynamic code execution"],
  [/\.innerHTML\s*=/, "innerHTML assignment"],
  [/\bdocument\.write\s*\(/, "document.write"]
];

for (const file of referencedFiles.filter((file) => file.endsWith(".js"))) {
  const source = await readFile(file, "utf8");
  for (const [pattern, description] of forbiddenSourcePatterns) {
    if (pattern.test(source)) {
      throw new Error(`${file} contains forbidden ${description}.`);
    }
  }

  if (file !== "ollama-client.js" && /\b(?:fetch|XMLHttpRequest)\s*\(/.test(source)) {
    throw new Error(`${file} contains an unauthorized network request.`);
  }
}

const ollamaClient = await readFile("ollama-client.js", "utf8");
if (!ollamaClient.includes('const OLLAMA_BASE_URL = "http://127.0.0.1:11434";')) {
  throw new Error("The Ollama client must stay pinned to the loopback server.");
}
const ollamaUrls = ollamaClient.match(/https?:\/\/[^"'`\s]+/g) || [];
if (ollamaUrls.some((url) => url !== "http://127.0.0.1:11434")) {
  throw new Error("The Ollama client contains a non-loopback URL.");
}

console.log(`Validated Manifest V3, permissions, CSP, and ${referencedFiles.length} referenced files.`);
