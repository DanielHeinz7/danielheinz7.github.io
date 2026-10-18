# Daniel Heinz's website

Personal academic website at https://daniel-heinz.de, built with Astro as a static site and hosted on GitHub Pages.

## Local development

Use Node.js 24, as recorded in `.node-version` and used by CI.

```sh
npm ci
npm run dev
```

The development server listens on localhost. Before sharing a build:

```sh
npm run verify
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

After changes, run `npm run verify`. It checks Astro types, analytics behavior, the build, and the generated site. The site check covers routes, local links and fragments, downloads, metadata, and accidental local paths. Read the changed pages at desktop and mobile widths as well.

## Analytics

The private dashboard is [daniel-heinz.goatcounter.com](https://daniel-heinz.goatcounter.com/). `Analytics.astro` supplies its public counting endpoint and fixed page/link metadata to `src/lib/analytics.mjs`. No dashboard password or API token belongs in the repository.

Only a production build served over HTTPS at the exact origin in `astro.config.mjs` reports visits. Local development, local previews, other preview hosts, frames, automated browsers, Do Not Track, and Global Privacy Control are excluded. Changing the canonical domain also changes the allowed analytics origin. Set `enabled: false` in `Analytics.astro` to disable collection entirely.

The small local script uses GoatCounter’s [documented counting endpoint](https://www.goatcounter.com/help/pixel). It sends fixed page paths/titles and allowlisted paper/CV click labels, with no query strings, fragments, referring URLs, screen size, cookies, or browser storage. Requests omit credentials and the HTTP referrer. No third-party JavaScript is loaded. Original-paper targets come from the existing publication data; internal paper explainers are counted as pages.

Keep the dashboard private and individual-pageview storage disabled in GoatCounter settings. GoatCounter’s [privacy policy](https://www.goatcounter.com/help/privacy) describes its temporary network-data processing and aggregate storage. The website’s factual notice is at `/privacy/`.

Run `npm run check:analytics` to verify local-host/privacy exclusions, event allowlisting, payload contents, and transport failure behavior. The release workflow includes this check. A live count still needs confirmation in the dashboard after publication; local QA deliberately sends no real events. Counts are approximate: ad blockers and disabled JavaScript can exclude visits, and a CV click does not prove a completed download. Direct PDF opens cannot run the site’s script. These statistics do not reconstruct individual browsing journeys.

## Publications and CV

Use title case for formal paper titles in `src/data/cv-publications.json` and `src/data/papers.json`: capitalize main words, keep articles, coordinating conjunctions, and prepositions lowercase unless they begin or end the title or subtitle, and preserve acronyms and proper names. Apply the same rule inside hyphenated terms, such as “AI-Based” and “Human-in-the-Loop”. Shared papers must have identical titles in both files. Editorial questions and explanatory headings stay in sentence case; original paper images retain their published lettering.

To regenerate the CV, install `scripts/requirements-pdf.txt` in a Python environment, then run `npm run build:cv`. Review every page of the resulting `public/files/daniel-heinz-cv.pdf` before committing it. Check journal-list completeness against the master CV and verify current citation metadata before adding records. The PDF uses only public profile information.

The complete CV is also available at `/cv/` as semantic HTML. Both formats use the same public profile, publication, project, and doctoral-research data. Keep the HTML version complete when extending the PDF.

## Web assets

The web uses responsive WebP images and WOFF2 fonts. Source images and TTF fonts remain unchanged. Regenerate the variants in a Python environment with `scripts/requirements-assets.txt` installed:

```sh
python scripts/build-image-variants.py
python scripts/build-font-variants.py
```

The image script also updates `src/data/image-variants.json`, consumed by the portrait and paper-image components. It converts the portrait’s embedded color profile to sRGB and uses lossless compression for paper pages. Review the result in the browser, including on mobile, when changing source images or display sizes.

## Release

`master` is the publishing branch. Pull requests to `master` run **Verify website** with the committed npm lockfile. After a merge or push to `master`, the same workflow verifies the source, uploads only `dist/`, and deploys that artifact to GitHub Pages. A failed check prevents deployment. Manual workflow runs publish only when run from `master`.

GitHub Pages must use **GitHub Actions** as its build source. The deployment uses GitHub’s built-in token and OIDC permissions; no personal access token or local hook is required. See the [GitHub Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

For an update:

1. Create a branch from the current `master` and edit the public source. Check dates, publication status, roles, and asset permissions against their sources.
2. If profile, projects, advising, or publication data changes, regenerate the PDF CV and inspect every page. Keep the HTML and PDF versions consistent.
3. Run `npm run verify`, inspect the changed pages in the browser, and commit all required source and asset changes.
4. Push the branch and open a pull request to `master`. Review the diff and wait for **Verify website** to pass before merging.
5. Confirm that **Publish website** succeeds, then open the live changed pages and check relevant links or downloads. The first release also needs a real visit confirmed in the private analytics dashboard.

For a rollback, revert the faulty update in a new commit on `master`; the verified deployment workflow publishes the corrected tree. Keep history intact and avoid force-pushing a deployed branch.

The canonical address is `https://daniel-heinz.de`. Set the custom domain in the repository’s GitHub Pages settings and maintain its DNS records at IONOS. This workflow deployment does not use a `CNAME` file. Keep `site` in `astro.config.mjs` and the online-CV link in `scripts/build-public-cv.py` consistent with the Pages setting. After a domain change, rebuild the PDF and check HTTPS, redirects, and analytics on the live site.

## Monthly upkeep

During the monthly review, compare the last website update with confirmed publication, teaching, role, project, and tool milestones. Suggest only changes with a source and a date. Group useful changes into one update; an uneventful month needs no commit. Keep private notes and unpublished project details outside this repository.

The monthly review proposes content changes. The update process above handles verification and publication. There is no scheduled scraper or unattended content rewrite.
