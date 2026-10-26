# Portfolio template

A simple professional portfolio built with Astro, Pages CMS, and GitHub Pages. Each person owns their own repository, content, and website.

Includes a shared profile, projects, research, certificates, achievements, light and dark themes, and a small animated portrait surround. Project covers can use an uploaded image, an automatic preview of a public deployed URL, or the default illustration. Research entries also have a default illustration.

## Create your portfolio

1. Click **Use this template → Create a new repository**.
2. Choose **your own GitHub account** as the owner.
3. Create a **public** repository named **`YOUR_USERNAME.github.io`**, using your actual GitHub username. This setup expects that repository name so all page and image paths work from the domain root. If you already use that address for another site, choose a separate hosting setup before proceeding.
4. In your new repository, open **Settings → Pages** and select **GitHub Actions** as the source.
5. Open **Actions → Deploy portfolio → Run workflow**, select `main`, and run it. If GitHub asks you to enable Actions, enable them first.
6. Wait for the deployment to finish. Your website will be at **`https://YOUR_USERNAME.github.io/`**.

The template repository itself skips deployment. Repositories created from it can deploy independently.

## Edit through Pages CMS

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with GitHub.
2. Install the Pages CMS GitHub App, selecting only your new portfolio repository.
3. Open that repository and the `main` branch. The `.pages.yml` configuration is already included.
4. Fill in **Profile**, **Site settings**, and **Experience, education & skills**. Enter your name and portrait once; all pages use the same profile.
5. Add projects, research, certificates, and achievements. Each collection starts with one generic **unpublished** example that you can replace or delete.
6. Enable **Published** on entries you want visitors to see, then save. Enable **Show on homepage** to feature a project.

Saving content or media commits it to your own repository and triggers deployment. Wait for the latest run under **Actions** to succeed, then refresh your site. Draft entries are hidden from the website, but files in a public repository, including draft content and uploaded PDFs, remain publicly accessible in its source.

## Images and project previews

- Upload a portrait under **Profile → Portrait photo**. For a web-sized portrait, aim for a JPG or WebP around 800 × 800 pixels and below 500 KB. This is a practical target, not a guaranteed CMS upload limit.
- Upload a CV, paper, or certificate as a PDF through its corresponding field.
- A project uses its uploaded **Cover image** first. If that is empty and **Live project URL** is filled in, the deployment attempts a desktop screenshot of that public page.
- A missing URL, failed capture, or recognized sign-in page uses the default project image. For private dashboards or a particular screen, upload your own screenshot.
- Project previews refresh on deployment. They need no API key or additional service account. GitHub's hosted Ubuntu runner provides Google Chrome for the capture step.
- Research entries without an image use the default research illustration.

## Run locally

Install Node.js **22.12 or newer** and npm **9.6.5 or newer**:

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro, usually `http://localhost:4321`.

```bash
npm run check
npm run build
npm run preview
```

To generate project previews locally, have Google Chrome installed and run `npm run screenshots` before building. Otherwise projects use their uploaded cover or the default illustration.

## Content files

| File or folder | Content |
| --- | --- |
| `src/data/profile.json` | Name, introduction, portrait, CV, contact links |
| `src/data/career.json` | Experience, education, skills |
| `src/data/site.json` | Tagline and search description |
| `src/content/projects/` | One Markdown file per project |
| `src/content/research/` | One Markdown file per publication or study |
| `src/content/certificates/` | One Markdown file per certificate |
| `src/content/achievements/` | One Markdown file per achievement |
| `public/uploads/` | Uploaded images and PDF files |

Client copies are independent: changes in one person's repository do not affect anyone else's. Later improvements to this template must be applied separately to existing copies.


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
