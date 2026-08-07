/**
 * Prints the SHA-256 of every inline <script> in the built index.html, and
 * checks that netlify.toml's script-src carries each one.
 *
 * The anti-flash theme script in index.html has to be inline — it must run
 * before the first paint, and an external file is a second round trip. With
 * `script-src 'self'` and no 'unsafe-inline', the only way to allow exactly
 * that script and nothing else is its hash. Which means editing it by one
 * character — including whitespace — silently disables it, and the flash it
 * exists to prevent comes back with no error anywhere except a CSP report.
 *
 * Run after `npm run build`. Exits non-zero if a hash is missing, so it can
 * join the verification gate.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const toml = readFileSync(new URL("../../netlify.toml", import.meta.url), "utf8");

const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([^]*?)<\/script>/g)];
if (inline.length === 0) {
  console.error("no inline <script> found in dist/index.html");
  process.exit(1);
}

let missing = 0;
for (const [, body] of inline) {
  const hash = `sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`;
  const present = toml.includes(hash);
  if (!present) missing++;
  console.log(`${present ? "✓" : "✗"} '${hash}'  (${body.length} bytes)`);
}

if (missing) {
  console.error(
    `\n${missing} inline script hash(es) not in netlify.toml's script-src — the browser will drop them.`
  );
  process.exit(1);
}
console.log("\nnetlify.toml's script-src covers every inline script.");
