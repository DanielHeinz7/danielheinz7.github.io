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

Research summaries and paper explainers share `src/data/papers.json`. The overview and CV use `src/data/profile.json`. Keep descriptions grounded in published work and current institutional information. Only public material belongs in `src/` and `public/`.

After changes, run `npm run check`, `npm run build`, and `npm run check:site`. The last command checks generated routes, local links and fragments, downloads, metadata, and accidental local paths. It does not replace reading the pages at desktop and mobile widths.

To regenerate the CV, install `scripts/requirements-pdf.txt` in a Python environment, then run `npm run build:cv`. Review the resulting `public/files/daniel-heinz-cv.pdf` before committing it. The PDF contains selected published work; it is not a copy of an application CV.

## Release

The GitHub Pages workflow is manual only. A release requires the finished source on the repository's release branch, GitHub Pages configured to use Actions, and an explicit run of **Publish website**. The workflow checks and builds the static output before deployment. Its structure follows the [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

The canonical site URL currently uses the repository's existing GitHub Pages address. When the custom domain is connected, update `site` in `astro.config.mjs` and add the corresponding `public/CNAME` as part of that release.
