# djub · Django Users Berlin

A small Eleventy website for event pages displayed at meetups. Each page has a
title and short description, with an optional date, venue, and one QR code.
The homepage lists all pages alphabetically; pages do not expire automatically.

## Local development

Install Node.js 24 or newer and [just](https://just.systems/), then run:

```sh
just setup
just dev
```

Open http://localhost:8080. Changes reload automatically. Run `just` to list tasks.
The equivalent npm commands are in `package.json` if just is unavailable.

## Add an event page

```sh
just new september-meetup "September meetup"
```

Edit `src/events/september-meetup.md`:

```markdown
---
title: "September meetup"
event_date: "2026-09-24"
venue: "Your venue, Berlin"
qr_url: "https://example.org/registration"
qr_label: "Register for the meetup"
---

An evening of Django talks and conversation.

Doors open at 18:30. Talks start at 19:00.
```

Only the title and description are needed. Omit `qr_url` to use the full-width
layout without a QR code. QR destinations must be absolute HTTP(S) URLs. SVG QR
codes are generated locally during the build, with a white quiet zone and a
clickable text link for phone users. No browser JavaScript or QR service is used.

Use a quoted `YYYY-MM-DD` value for `event_date` (distinct from Eleventy's page
date). Keep descriptions short for projection. `qr_label` defaults to
“Open event link”; prefer something specific to the destination.

The filename determines the stable URL: `september-meetup.md` becomes
`/events/september-meetup/`. Keep that filename when editing an existing page.
The generator refuses to overwrite files. Delete a Markdown file to remove a
page on the next deployment.

### Short links

Add optional aliases to a page's front matter:

```yaml
aliases:
  - /sep-2026
  - /september
```

After deployment, `https://djub.frkl.dev/sep-2026` redirects to the September
event's primary URL. The homepage lists the event only once. Aliases use a
small HTML redirect with a clickable fallback; no browser JavaScript is needed.
GitHub Pages adds a trailing slash to these directory URLs.

Use root paths with lowercase letters, numbers, and hyphens. The trailing slash
is optional. Duplicate aliases and collisions with page URLs or the reserved
`/assets/` and `/events/` directories fail the build. Include no domain or
`/djub/` prefix: the build adds the deployment prefix to redirect targets.
Removing an alias removes its redirect on the next clean build and deployment.

Two starter pages demonstrate the layout with and without a QR code. Edit or
remove them before publishing your own events.

## Common tasks

| Command | Purpose |
| --- | --- |
| `just setup` | Install dependencies from the lockfile |
| `just dev` | Preview with live reload |
| `just new slug "Title"` | Create an event Markdown file |
| `just build` | Clean and build into `_site/` |
| `just check` | Build and check generated pages and local links |
| `just check /djub/` | Also verify GitHub project Pages URL prefixes |
| `just clean` | Remove `_site/` |

Before an event, open the page at the target screen size and scan its QR code
with a phone. Long descriptions or URLs can need a layout/content adjustment;
the automated checks do not replace a real scan from the audience's distance.

## GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, select
**GitHub Actions** as the source. Push to `main` to build, check, and deploy.
The workflow can also be started manually from the Actions tab.

For `makkus/djub`, the default site address is `https://makkus.github.io/djub/`.
The workflow reads the site's base path from GitHub Pages, so asset and event
links also work with a custom domain. Locally, the default path prefix is `/`.
GitHub Pages must be enabled before the deployment workflow can succeed.

See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [Eleventy's deployment guide](https://www.11ty.dev/docs/deployment/).

## Structure

```text
src/
  _includes/base.njk     HTML shell and djub logo
  _includes/event.njk    Reusable screen-first event layout
  events/               Event Markdown and shared defaults
  index.njk             Simple list of all events
  styles.css            Branding and responsive layout
assets/logo/            Supplied djub artwork
scripts/                New-page, cleanup, and output checks
eleventy.config.js      Static build and QR generation
justfile                Everyday commands
.github/workflows/      GitHub Pages deployment
```

The layout uses the existing logo's green and pale palette, large system sans-serif
type, and a two-column arrangement for text and QR. On small screens the columns
stack. Without a QR, the description occupies a single wide column. Page content
and templates are trusted repository content.

See [CONTEXT.md](CONTEXT.md) for the domain glossary. This scaffold deliberately
keeps configuration in a few editable files; no separate ADR is needed for these
readily reversible choices.
