import { writeFile } from "node:fs/promises";

const [slug, title, ...extra] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title?.trim() || extra.length) {
  console.error('Usage: just new my-event "My event title" (lowercase slug with hyphens)');
  process.exit(1);
}
const path = new URL(`../src/events/${slug}.md`, import.meta.url);
const content = `---
title: ${JSON.stringify(title)}
# aliases:
#   - /my-short-link
# event_date: "2026-09-24"
# venue: "Venue name, Berlin"
# qr_url: "https://example.org/registration"
# qr_label: "Register for the meetup"
---

Write a short description of the event here.
`;
try {
  await writeFile(path, content, { flag: "wx" });
  console.log(`Created src/events/${slug}.md`);
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.error(`src/events/${slug}.md already exists; choose another slug.`);
  process.exit(1);
}
