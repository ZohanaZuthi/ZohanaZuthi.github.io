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

In Pages CMS → Profile, use the optional IEEE Xplore URL field, or add entries under **Additional links**. Paste your full profile URL; the platform name and icon are detected automatically for supported sites. The optional **Nickname** field overrides the displayed name, for example “My IEEE profile”. Other websites use a globe icon. Empty entries are hidden, and duplicate URLs appear once. Links are shared across the homepage, sidebar, and footer. Existing profile links do not need to be re-entered.

## Homepage, achievement galleries and certificate images

The homepage shows About, Research & publications, Projects, then Milestones and the selected Gallery preview. Academic background appears on About and is managed in Experience, education & skills → Education. Explore my work opens Research. Download CV uses the PDF saved in Profile → CV and is hidden if no CV is uploaded. The About page lists education, experience and skills; the About me text remains on the homepage.

For multiple achievement photos, open Pages CMS → Achievements & awards → an entry → Gallery photos. Add photos with optional captions. All photos are displayed directly on the Recognition page, alongside the existing cover image. A cover already included in the gallery is shown only once. Gallery photos also appear on the achievement detail page and open at full size when clicked.

Certificate images use a landscape A4-style frame on the recognition listing and certificate detail pages. The full image is contained within the frame; portrait scans are supported without cropping. Existing image and PDF fields remain compatible.

Experience descriptions preserve Enter/newline formatting and blank lines. Use the optional Related URL field to link to an organization, project or reference website. Leaving it empty hides the link.

## Homepage gallery and named experience links

For award and project photos, select **Show in gallery** on each photo or **Show cover in gallery** on the entry. Certificates have **Show certificate in gallery**. No duplicate uploads or entries are needed. For unrelated photos, add a published entry under **Pages CMS → Gallery**, with a title, caption, date, optional location and related URL. Up to three photos selected with the separate homepage checkbox appear below Milestones; **View full gallery** shows published standalone gallery entries and explicitly selected photos. Reused image paths appear once.

Local gallery photos get 320px/640px WebP thumbnails automatically before `npm run dev` and `npm run build`. Gallery cards and award galleries use these shared thumbnails and lazy loading. Clicking a photo opens the original. Generated files are ignored by Git; original uploads remain untouched. Remote or unsupported images use their original URL. Run `npm run thumbnails` and restart the dev server after adding photos locally.

Experience links use **Related URL** as the destination and **Link title** as the clickable text. Without a custom title, the organization name or “View related page” is used. Certificates appear before awards on Recognition.

Education entries support optional **Related URL** and **Link title** fields, just like experience. The link uses the custom title or the institution name and stays hidden when no URL is supplied. Academic background is listed on About; the homepage does not repeat the education timeline.

## Listing actions, gallery selections and education links

Research listing cards show Read publication and Download PDF when supplied. Project cards show Visit project and View source when supplied. Project photos and captions can be managed under Projects; they appear on the project detail page.

Only selected award/project photos and certificate covers are reused in Gallery. Homepage selections are managed separately as described below. Unchecked photos stay visible on their original entry but are excluded from Gallery. Standalone Gallery entries appear when Published; Feature on homepage additionally selects the preview. Shared images appear once if any published entry selects them; remove every selection (or unpublish any standalone copy) to remove a shared image from Gallery. Thumbnails are generated for projects and certificates too.

Gallery is available in the header on every page. Captions use consistent image proportions and left alignment. Education retains Related URL and Link title and also supports an optional Additional URLs list with URL and Label text fields. Existing education data is preserved.

## Manual ordering and the three-photo homepage gallery

Every project, research entry, certificate, award and standalone gallery entry has an optional **Display order**. Set 1, 2, 3, etc. Numbered entries appear before unnumbered ones; dates break ties and sort entries without an order. Certificates still come before awards on Recognition.

**Show in gallery** selects a photo for the full Gallery only. Use **Feature on homepage** on an award/project photo, **Feature cover on homepage** on a cover/certificate, or **Feature on homepage** on a standalone Gallery entry to select the homepage row. Select your preferred three; if more are selected, the three with the lowest display order appear. Photo display order overrides its entry order. The homepage shows at most three photos, with responsive stacking on small screens. No photos are selected automatically.
