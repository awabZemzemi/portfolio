# Awab Zemzemi · Engineering portfolio

A portfolio with two project case studies built with the Next.js App Router, TypeScript, Tailwind CSS, and Lucide. The homepage is prerendered at build time. Next.js fetches Bricolage Grotesque and the IBM Plex fonts at build time and serves them with the site.

## Run locally

Use Node.js 22.13 or later within the 22.x release line, with npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). To check and serve a production build, run:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:smoke
npm start
```

## Continuous integration

GitHub Actions runs **CI → Portfolio checks** on pushes to `main` and pull requests targeting `main`. The Ubuntu runner uses Node.js 22 and npm caching. It installs from the lockfile with `npm ci` and runs lint, type checking, unit tests, the production build, and production smoke tests. To diagnose a failure, open the PR’s **Checks** tab or the repository’s **Actions → CI** page, select the run, and expand the failed step.

### Protect main in GitHub

1. Commit and push this workflow on a branch, then open a pull request targeting `main` so GitHub can register the **Portfolio checks** job.
2. In the repository, open **Settings → Rules → Rulesets → New ruleset → New branch ruleset**. Name it, set enforcement to **Active**, and target `main`.
3. Enable **Require a pull request before merging** and **Require status checks to pass**. Add **Portfolio checks**, selecting **GitHub Actions** as its source if prompted. Keep the bypass list empty if every merge should require CI.
4. Save the ruleset and confirm the PR shows the required check before merging. [GitHub ruleset setup](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)

## Continuous deployment on Vercel

1. Open **Vercel Dashboard → Add New → Project** and connect GitHub. Grant the Vercel GitHub app access to `awabZemzemi/portfolio`, then select **Import** beside the repository.
2. Use the **Next.js** framework preset and leave the root directory and build settings at their defaults. The build uses the repository’s `build` script. The package declares Node.js 22 and the site requires no environment variables. Select **Deploy**. [Vercel Node.js settings](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
3. Verify **Project Settings → Environments → Production → Branch Tracking** is set to `main`. Open the production URL from **Deployments** and check the homepage and both project routes.
4. For subsequent changes, push a feature branch and open a PR to `main`. Vercel creates the preview through its Git integration and surfaces the link on GitHub. When the PR merges, Vercel builds the new `main` commit for production. [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github)

Vercel’s Git deployments run independently of GitHub Actions. The protected merge workflow keeps failing changes off `main` while Vercel can still build previews for review.

To connect a domain later, open **Project Settings → Domains**, add a domain you own to the Production environment, and apply the DNS records Vercel provides. Wait for the dashboard to verify the domain. [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

## Search indexing and evidence

Set `PORTFOLIO_SITE_URL` to the verified public HTTPS origin in the production environment and rebuild to populate canonical URLs and sitemap entries. Without it, the sitemap has no entries and robots.txt omits its reference.

The AIOps case study uses the sanitized [Kind capture](docs/aiops-demo/evidence.json), with provenance documented in the [evidence notes](docs/aiops-demo/README.md). Update the JSON only with reviewed evidence.

## Project structure

```text
src/
  app/
    layout.tsx             Fonts and SEO metadata
    page.tsx               Homepage composition and CV availability
    projects/              AIOps and Second Brain case studies
    globals.css            Design tokens, layouts, and responsive styles
    icon.svg               Portfolio mark
  components/
    brand.tsx              Name and board mark
    content-sections.tsx   About, project board, timeline, and contact
    architecture/          Responsive diagrams and playback state
    navigation.tsx         Section navigation and mobile disclosure
    workflow.tsx           Design, build, deploy, and observe stages
  config/
    portfolio.ts           Profile, optional links, projects, and experience
```

## Update your profile and links

Edit `src/config/portfolio.ts`. The `profile` object supplies the name, introduction, and About copy. In `links`, set `email` to a plain email address, and set `github` and `linkedin` to your verified HTTPS profile URLs. Leave any unavailable field as `undefined`.

The public résumé is at `public/cv.pdf`. Use a copy with private contact details removed when replacing it and set `links.cv` to `"/cv.pdf"`. If you keep a different filename, set `links.cv` to the matching root-relative URL. Both download links appear only when the configured file exists. Rebuild after changing content or adding the file.

Add verified roles to `experience` and academic entries to `education`, in display order. Each entry has an ID, role, organization, period, and location. Add optional highlights and a technology list. Empty groups are hidden.

## Add real projects in Phase 2

1. Open the typed `projects` array in `src/config/portfolio.ts`.
2. Append one record per project with a unique `id`, a real `title`, and a concise `description` explaining what it does. Supply the optional `url` when a repository, demo, or case study is ready.
3. Arrange the records in the desired reading order and run the checks above.

Adding the first record displays Selected Projects, enables its navigation link, and redirects Explore Work to the board. Cards without a URL display their title as plain text. With an empty project list, Explore Work points to Experience, or About if the timeline is also empty.
