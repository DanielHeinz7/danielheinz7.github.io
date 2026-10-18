# Daniel Heinz's website

Personal academic website at https://danielheinz7.github.io, built with Astro as a static site.

## Local development

Requires Node.js 22.22 or later (an even-numbered release).

```sh
npm ci
npm run dev
```

The development server listens on localhost. Before sharing a build:

```sh
npm run check
npm run build
npm run preview
```

Astro writes the site to `dist/`. Only `src/` and `public/` supply site content; the retained Jekyll files are historical source and are not part of the Astro build.

## Structure

- `src/layouts/SiteLayout.astro`: shared document metadata, cover, and reading column.
- `src/data/site.ts`: public contact details and navigation.
- `src/styles/global.css`: the shared visual system.
- `src/pages/`: page routes.
- `public/`: public images, fonts, icons, and documents. Asset origins and licenses are in `public/ASSET-SOURCES.md`.

Use `SiteLayout` with `title`, optional `description`, `active`, and `bodyClass` props. It supplies the main landmark; pass page content in its default slot. The optional `head` slot supports page-specific metadata. Pages can add `SiteFooter` after their content.

Local development and builds do not publish the site.

## Content and verification

Research summaries and paper explainers share `src/data/papers.json`. The overview and CV use `src/data/profile.json`. The CV publication record lives in `src/data/cv-publications.json`: all published or accepted journal articles, followed by selected conference papers. Keep it complete independently of the website explainer selection and label accepted work that is not yet published. Keep descriptions grounded in published work and current institutional information. Only public material belongs in `src/` and `public/`.

After changes, run `npm run check`, `npm run build`, and `npm run check:site`. The last command checks generated routes, local links and fragments, downloads, metadata, and accidental local paths. It does not replace reading the pages at desktop and mobile widths.

## Analytics

The private dashboard is [daniel-heinz.goatcounter.com](https://daniel-heinz.goatcounter.com/). `Analytics.astro` supplies its public counting endpoint and fixed page/link metadata to `src/lib/analytics.mjs`. No dashboard password or API token belongs in the repository.

Only a production build served over HTTPS at the exact origin in `astro.config.mjs` reports visits. Local development, local previews, other preview hosts, frames, automated browsers, Do Not Track, and Global Privacy Control are excluded. Changing the canonical domain also changes the allowed analytics origin. Set `enabled: false` in `Analytics.astro` to disable collection entirely.

The small local script uses GoatCounter’s [documented counting endpoint](https://www.goatcounter.com/help/pixel). It sends fixed page paths/titles and allowlisted paper/CV click labels, with no query strings, fragments, referring URLs, screen size, cookies, or browser storage. Requests omit credentials and the HTTP referrer. No third-party JavaScript is loaded. Original-paper targets come from the existing publication data; internal paper explainers are counted as pages.

Keep the dashboard private and individual-pageview storage disabled in GoatCounter settings. GoatCounter’s [privacy policy](https://www.goatcounter.com/help/privacy) describes its temporary network-data processing and aggregate storage. The website’s factual notice is at `/privacy/`.

Run `npm run check:analytics` to verify local-host/privacy exclusions, event allowlisting, payload contents, and transport failure behavior. The release workflow includes this check. A live count still needs confirmation in the dashboard after publication; local QA deliberately sends no real events. Counts are approximate: ad blockers and disabled JavaScript can exclude visits, and a CV click does not prove a completed download. Direct PDF opens cannot run the site’s script. These statistics do not reconstruct individual browsing journeys.

## Publications and CV

Use title case for formal paper titles in `src/data/cv-publications.json` and `src/data/papers.json`: capitalize main words, keep articles, coordinating conjunctions, and prepositions lowercase unless they begin or end the title or subtitle, and preserve acronyms and proper names. Apply the same rule inside hyphenated terms, such as “AI-Based” and “Human-in-the-Loop”. Shared papers must have identical titles in both files. Editorial questions and explanatory headings stay in sentence case; original paper images retain their published lettering.

To regenerate the CV, install `scripts/requirements-pdf.txt` in a Python environment, then run `npm run build:cv`. Review every page of the resulting `public/files/daniel-heinz-cv.pdf` before committing it. Check journal-list completeness against the master CV and verify current citation metadata before adding records. The PDF uses only public profile information.

## Release

The GitHub Pages workflow is manual only. A release requires the finished source on the repository's release branch, GitHub Pages configured to use Actions, and an explicit run of **Publish website**. The workflow checks and builds the static output before deployment. Its structure follows the [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

The canonical site URL currently uses the repository's existing GitHub Pages address. When the custom domain is connected, update `site` in `astro.config.mjs` and add the corresponding `public/CNAME` as part of that release.
