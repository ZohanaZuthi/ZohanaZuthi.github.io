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

Project covers use your uploaded image first. If the cover is empty and a Live project URL is provided, GitHub Actions captures a desktop preview of that public page during deployment. If there is no URL or the capture fails, the default project illustration appears. Pages behind sign-in need an uploaded screenshot. Previews refresh on each deployment and require no API key or extra account.

To generate project previews locally (optional), have Google Chrome installed and run:

```bash
npm run screenshots
npm run build
```

## How publishing works

Pages CMS reads `.pages.yml` and saves edits to this repository. Entries with `published: false` are excluded from the public pages. A push to `main` runs `.github/workflows/deploy.yml`, which checks and builds the site before publishing it to GitHub Pages. The editor and GitHub setup are intentionally left for a separate step.

For the easiest GitHub Pages URL, create the client's repository as `USERNAME.github.io`, replacing `USERNAME` with their GitHub username. GitHub Pages can then serve the site at `https://USERNAME.github.io/` without extra path configuration. The repository must be public on GitHub Free. Uploaded media and draft content in a public repository are visible in its source, even if the site hides draft entries.
# ZohanaZuthi.github.io


## Profile links and education

The sidebar, homepage, and footer reuse the contact links from **Pages CMS → Profile**. Optional links include LinkedIn, GitHub, Google Scholar, ORCID, ResearchGate, arXiv, PubMed, email, and CV. Empty fields stay hidden.

The university line uses the first education entry with an institution in **Experience, education & skills → Education**. Put the institution you want displayed first. No profile or career data needs to be recreated for this update.

The site uses a self-hosted Inter font, wider content columns, and justified long paragraphs on desktop. Mobile paragraphs stay left-aligned for readability.

## Updating an existing client portfolio

Provide changes through a pull request against the client's existing repository. Keep these client-owned paths unchanged:

- `src/data/`
- `src/content/`
- `public/uploads/`

Review the pull request's **Files changed** tab before merging. This display update changes components, layout, styles, helper modules, the CMS field definitions, font assets, and package files; it does not replace client content. Merge both `package.json` and `package-lock.json` together. Review conflicts or custom code changes before merging.

Applying a new template ZIP over the whole repository can overwrite content. A template copy does not automatically synchronize updates, so each update should be reviewed and tested in the client repository. Merging the reviewed code update triggers the normal deployment.

## Adding more profile links

In Pages CMS → Profile, use the optional IEEE Xplore URL field, or add entries under **Additional links**. Paste your full profile URL; the platform name and icon are detected automatically for supported sites. An optional label can override the displayed name. Other websites use a globe icon. Empty entries are hidden, and duplicate URLs appear once. Links are shared across the homepage, sidebar, and footer. Existing profile links do not need to be re-entered.
