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
