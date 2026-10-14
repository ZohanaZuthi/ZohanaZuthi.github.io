# Simple portfolio template

A small professional portfolio built with Astro. Pages CMS is configured to edit the content and upload images and PDF files. GitHub Actions can publish the built site to GitHub Pages.

## Run locally

Install Node.js 22 or newer, then run:

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro, usually `http://localhost:4321`. To check and build the production site:

```bash
npm run check
npm run build
npm run preview
```

## Edit content before connecting Pages CMS

- `src/data/profile.json`: name, introduction, contact links, photo, and CV.
- `src/data/site.json`: tagline and search description.
- `src/data/career.json`: repeatable experience, education, and skill groups for the About page.
- `src/content/projects/`: one Markdown file per project.
- `src/content/research/`: one Markdown file per publication or research entry.
- `src/content/certificates/`: one Markdown file per certificate.
- `src/content/achievements/`: one Markdown file per award or achievement.
- `public/uploads/`: images and PDFs. Use paths such as `/uploads/images/photo.webp` in content.

Example entries are clearly marked. Replace or delete them before publishing.

The homepage shows up to three featured projects, the three newest research entries, and two achievements. The Projects, Research, and Recognition pages show every published entry. Set `featured: true` on a project to choose it for the homepage. The portrait's small Three.js effect runs only when motion is allowed; the profile image remains visible without it.

## How publishing works

Pages CMS reads `.pages.yml` and saves edits to this repository. Entries with `published: false` are excluded from the public pages. A push to `main` runs `.github/workflows/deploy.yml`, which checks and builds the site before publishing it to GitHub Pages. The editor and GitHub setup are intentionally left for a separate step.

For the easiest GitHub Pages URL, create the client's repository as `USERNAME.github.io`, replacing `USERNAME` with their GitHub username. GitHub Pages can then serve the site at `https://USERNAME.github.io/` without extra path configuration. The repository must be public on GitHub Free. Uploaded media and draft content in a public repository are visible in its source, even if the site hides draft entries.
# ZohanaZuthi.github.io
