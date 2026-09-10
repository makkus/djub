import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const output = new URL("../_site/", import.meta.url);
const prefix = `/${(process.env.PATH_PREFIX || "").split("/").filter(Boolean).join("/")}`.replace(/\/$/, "") + "/";
const files = await readdir(output, { recursive: true });
const pages = files.filter((file) => file.endsWith(".html"));
assert(pages.includes("index.html"), "Missing homepage");
for (const file of pages) {
  const html = await readFile(new URL(file, output), "utf8");
  assert(/<h1[ >]/.test(html), `${file}: missing heading`);
  assert(!/<script[ >]/.test(html), `${file}: unexpected browser JavaScript`);
  assert(!/\{%|\{\{/.test(html), `${file}: unrendered template`);
  const redirect = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
  if (redirect) {
    assert(html.includes(`rel="canonical" href="${redirect[1]}"`), `${file}: redirect and canonical disagree`);
    assert(html.includes(`<a href="${redirect[1]}">`), `${file}: missing redirect fallback link`);
    assert.notEqual(redirect[1], prefix + file.replace(/index\.html$/, ""), `${file}: redirect loop`);
  }
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith("/")) continue;
    assert(url.startsWith(prefix), `${file}: URL outside path prefix: ${url}`);
    const relative = url.slice(prefix.length).split(/[?#]/)[0];
    await access(new URL(relative.endsWith("/") || !relative ? join(relative, "index.html") : relative, output));
  }
}
console.log(`Checked ${pages.length} pages and their local links (prefix ${prefix}).`);
