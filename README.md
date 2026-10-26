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
- `src/lists/projects.json`: one Markdown file per project.
- `src/lists/research.json`: one Markdown file per publication or research entry.
- `src/lists/certificates.json`: one Markdown file per certificate.
- `src/lists/achievements.json`: one Markdown file per award or achievement.
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

For award photos, select **Show in gallery** on each photo or **Show cover in gallery** on the entry. Certificates have **Show certificate in gallery**. No duplicate uploads or entries are needed. For unrelated photos, add a published entry under **Pages CMS → Gallery**, with a title, caption, date, optional location and related URL. Up to three photos selected with the separate homepage checkbox appear below Milestones; **View full gallery** shows published standalone gallery entries and explicitly selected photos. Reused image paths appear once.

Local gallery photos get 320px/640px WebP thumbnails automatically before `npm run dev` and `npm run build`. Gallery cards and award galleries use these shared thumbnails and lazy loading. Clicking a photo opens the original. Generated files are ignored by Git; original uploads remain untouched. Remote or unsupported images use their original URL. Run `npm run thumbnails` and restart the dev server after adding photos locally.

Experience links use **Related URL** as the destination and **Link title** as the clickable text. Without a custom title, the organization name or “View related page” is used. Certificates appear before awards on Recognition.

Education entries support optional **Related URL** and **Link title** fields, just like experience. The link uses the custom title or the institution name and stays hidden when no URL is supplied. Academic background is listed on About; the homepage does not repeat the education timeline.

## Listing actions, gallery selections and education links

Research listing cards show Read publication and Download PDF when supplied. Project cards show Visit project and View source when supplied. Project photos and captions can be managed under Projects; they appear on the project detail page.

Only selected award photos and certificate covers are reused in Gallery. Homepage selections are managed separately as described below. Unchecked photos stay visible on their original entry but are excluded from Gallery. Standalone Gallery entries appear when Published; Feature on homepage additionally selects the preview. Shared images appear once if any published entry selects them; remove every selection (or unpublish any standalone copy) to remove a shared image from Gallery. Thumbnails are generated for projects and certificates too.

Gallery is available in the header on every page. Captions use consistent image proportions and left alignment. Education retains Related URL and Link title and also supports an optional Additional URLs list with URL and Label text fields. Existing education data is preserved.

## Add, edit and drag entries in the same editor

Open Projects, Research & publications, Certificates, Achievements & awards or Gallery in Pages CMS. Each section is now one editable list, like Experience and Education. Add an item, fill its fields, drag its grip to arrange it, and Save. The website follows the saved list order regardless of dates. There is no separate Arrange entries screen. Published controls visibility; removing an item removes it from the website after deployment.

Existing page addresses and all metadata, Markdown details, photo captions and upload paths are retained. For a new entry, Page address is optional and defaults to its title; enter a unique stable address if you want its URL to remain the same after renaming it. Existing addresses should be left unchanged.

Active content lives in `src/lists/projects.json`, `research.json`, `certificates.json`, `achievements.json` and `gallery.json`. Old `src/content/` Markdown files are preserved as backups and are not read once the corresponding list exists. An empty list stays empty, so deleted examples do not reappear. Old `src/settings/entry-order.json` is no longer used.

`npm run migrate` creates only missing lists from the repository's own Markdown files, preserving the previous order. It also runs before check, development and build. It never overwrites an existing list or deletes original files. For updates to client repositories, preserve `src/lists/` exactly like `src/data/` and `public/uploads/`; never copy template example lists onto client content. Generate a client's initial lists from their own checkout after pulling their latest CMS changes.

The homepage Gallery remains limited to three selected photos. Use Feature on homepage or Feature cover on homepage to select them. Gallery photo priorities remain compatible with previous values.

## Selected photos appear in the Gallery editor

Saving a selected award or certificate photo starts deployment. The build adds a shared record to `src/lists/gallery.json` and GitHub Actions saves it back to the repository. After deployment, refresh Pages CMS → Gallery to see, edit and drag those records alongside standalone photos. No image is uploaded again.

Linked records keep Gallery edits to captions, titles, homepage selection and visibility. Unedited values follow updates to the original entry. Unchecking both Gallery/homepage selections or unpublishing/removing the source removes its linked record; standalone Gallery records stay. To remove a linked record permanently, change its selection in the original entry. Gallery's saved list order controls the full page and the three selected homepage photos. A selected certificate needs an uploaded image.

`npm run gallery:sync` performs the same synchronization locally. It runs before checks, development and builds. The deployment needs repository content write permission to save only the Gallery list; Git pushes use normal conflict protection and never force-push over CMS changes.

## Project photos on the listing

Pages CMS → Projects → Project photos accepts multiple images with optional captions. All photos appear directly on the Projects listing in three columns on desktop, with two/one columns on smaller screens. A cover already included in the photos appears once. When photos exist without a cover, no extra default image is inserted. Short summary and Full story are optional; empty descriptions are hidden. Main Gallery selections are reserved for awards and certificates; project photos stay in their own entries.

Gallery integration applies only to awards/achievements and certificates. Projects retain their inline three-column photo galleries and optional descriptions, without Gallery or homepage-photo selection controls. The project card’s separate Show on homepage option still controls the Featured projects section.

Descriptions and image captions in Projects, Gallery, Certificates and Achievements use justified paragraphs on desktop, with the final line left-aligned. Narrow screens use left alignment for readability. Gallery and certificate cards share text rows so metadata, titles, summaries and links line up without clipping text.

### Private Analytics dashboard

Open `/analytics/` to see your portfolio's users, sessions, page views and users by country for the last 7, 30 or 90 days. It is not linked from the public navigation and asks search engines not to index it. The static page itself is public; Google protects the report and only returns it to an account with access to the configured Analytics property. Use a client-owned property with no other viewers if only the owner should see the reports. A hidden URL is not authentication.

One-time setup for each client:

1. In [Google Analytics](https://analytics.google.com/), create a GA4 property and a Web data stream for the client's portfolio URL. Copy its `G-...` measurement ID. In Admin → Property details, copy the separate numeric property ID.
2. In a client-owned [Google Cloud project](https://console.cloud.google.com/), enable **Google Analytics Data API** (`analyticsdata.googleapis.com`). Configure Google Auth Platform branding, audience and data access, requesting only `https://www.googleapis.com/auth/analytics.readonly`. For a personal test deployment, add the owner's Google account as a test user; testing authorizations expire after seven days and require reconnecting. Google may show an unverified-app notice for a personal app. A broadly distributed app may need OAuth verification; do not share one test OAuth app across unrelated clients.
3. Create an OAuth client of type **Web application**. Add the exact portfolio origin to **Authorized JavaScript origins**, e.g. `https://adib-hassan-1.github.io` (no path). For local development add the exact local origin you use, e.g. `http://localhost:4321`. Copy the client ID ending in `.apps.googleusercontent.com`. No client secret or service-account key belongs in this repository.
4. In Pages CMS → **Site settings**, enter the measurement ID, numeric property ID and OAuth client ID into their optional Analytics fields. Save, then wait for GitHub Pages deployment. Leaving the measurement ID blank disables tracking; leaving either dashboard ID blank shows setup instructions instead of a sign-in button that cannot work. These IDs are public configuration, not passwords.
5. Visit public portfolio pages to generate visits, then open `/analytics/` and click **Connect Google Analytics**. Select the Google account with Viewer or higher access to that property and grant read-only Analytics access. A Google login alone does not grant property access. Check tracking first in Google Analytics Realtime; the dashboard uses processed reports, which can lag and will not recover visits from before tracking was installed.

The dashboard calls Google's Data API directly from the owner's browser. It never uploads reports or tokens to GitHub, Pages CMS or a developer backend. Tokens live only in page memory, expire, and are cleared on leaving/reloading; Disconnect clears the report and revokes this app's Google access. Public page tracking deliberately excludes `/analytics/`. Country counts are aggregate estimates, not names, email addresses or a list of identifiable visitors. Overall users are requested separately rather than summed across countries, since a user can appear in more than one country. No data is fabricated when setup, access or reporting fails.

Google Analytics visitor collection and this owner's report connection are separate: enabling the measurement ID adds Google's visitor tracking script to public pages. Before enabling it, configure the site's visitor notice and consent handling as appropriate for its audience. No tracking is enabled by default in the template.

Reference: [Google browser authorization](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [Data API reporting](https://developers.google.com/analytics/devguides/reporting/data/v1/basics).

Validate the dashboard's report and connection behavior with `node --test tests/analytics.test.mjs`, then `npm run check` and `npm run build`. A live owner sign-in still requires the real Google configuration above.

### Search visibility and sharing

Every public page has a descriptive title and description, canonical URL, Open Graph/X sharing metadata and entry-specific preview images. The homepage includes Person structured data based on the visible profile. `/sitemap.xml` is generated from published projects, research, certificates and achievements plus public section pages. `/robots.txt` points to it. The owner Analytics page and 404 page remain noindex and are omitted from the sitemap. Do not block `/analytics/` in robots.txt: Google must be able to read its noindex directive.

A `USERNAME.github.io` repository detects its own production URL during GitHub Actions builds. For a custom domain, fill **Site settings → Website URL** with its full HTTPS URL. Do not copy the template author's URL into a client's settings. For a local production preview, use `PUBLIC_SITE_URL=https://yourname.github.io npm run build`. An unconfigured local/template build deliberately omits production canonical URLs instead of advertising localhost or another owner's domain. The existing template assumes hosting at the domain root; this update does not add project-subdirectory hosting.

In Pages CMS → Site settings, write a meaningful **Search description**, e.g. `Alex Morgan is a software developer building accessible web applications. Explore projects, experience and selected writing.` Use your real specialization, not a list of search keywords. Add an optional **Default sharing image** (1200 × 630 is a useful format); detail pages use their own image when available. Your portrait is the fallback.

To request Google discovery after publishing:

1. Open [Google Search Console](https://search.google.com/search-console/) with your own account and add a **URL prefix** property for your exact website URL.
2. Select **HTML tag** verification. Paste only the tag's `content` value into Pages CMS → Site settings → **Google Search Console verification code**. Save, wait for deployment, then click Verify in Search Console.
3. In Search Console → **Sitemaps**, submit `sitemap.xml`. Use URL inspection for the homepage and important entries. Analytics tracks visits; Search Console reports Google search visibility. They are separate tools.
4. Replace example/test entries, use clear project/research titles, describe your contribution and results accurately, write useful image captions, and link your portfolio from your genuine professional profiles. Keep descriptions readable and specific. Google controls crawling, indexing and rankings; sitemap submission, structured data and performance changes do not guarantee placement.

For general appeal, keep your name, specialization, strongest work and contact/CV easy to find. Keep the existing light default and optional dark mode, use consistent photos and captions, and avoid filling the homepage with every record. Decorative Three.js math now loads dynamically rather than as an eager dependency, is skipped for reduced motion, and pauses when the page is hidden. No Lighthouse score or ranking improvement is claimed without a measured audit.

Checks: `node --test tests/seo.test.mjs`; after building for a real origin, `EXPECTED_SITE_URL=https://yourname.github.io node --test tests/seo.test.mjs` verifies the generated metadata, sitemap, private-page exclusions and structured data. Also run `npm run check` and `npm run build`.
