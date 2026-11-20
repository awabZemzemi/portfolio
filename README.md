# Awab Zemzemi · Engineering portfolio

A single-page portfolio built with the Next.js App Router, TypeScript, Tailwind CSS, Motion, and Lucide. The homepage is prerendered at build time. Geist Sans and Geist Mono are served locally. The layered architecture illustration is an inline vector diagram.

## Run locally

Use Node.js 22.13 or later and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). To check and serve a production build, run:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Project structure

```text
src/
  app/
    layout.tsx             Fonts and SEO metadata
    page.tsx               Homepage composition and CV availability
    globals.css            Design tokens, layouts, and responsive styles
    icon.svg               Portfolio mark
  components/
    architecture.tsx       Layered system diagram
    brand.tsx              Name and board mark
    content-sections.tsx   About, project board, timeline, and contact
    entrance.tsx           Reduced-motion-aware hero entrance
    navigation.tsx         Section navigation and mobile disclosure
    workflow.tsx           Design, build, deploy, and observe stages
  config/
    portfolio.ts           Profile, optional links, projects, and experience
```

## Update your profile and links

Edit `src/config/portfolio.ts`. The `profile` object supplies the name, introduction, and About copy. In `links`, set `email` to a plain email address, and set `github` and `linkedin` to your verified HTTPS profile URLs. Leave any unavailable field as `undefined`.

For a CV, place the real PDF in `public/` (create the directory if needed) and set `links.cv` to its public path, such as `/cv.pdf`. Both download links appear only when the configured file exists. Rebuild after changing content or adding the file.

Add verified roles to `experience` and academic entries to `education`, in display order. Each entry has an ID, role, organization, description, and optional period. Empty groups are hidden.

## Add real projects in Phase 2

1. Open the typed `projects` array in `src/config/portfolio.ts`.
2. Append one record per project with a unique `id`, a real `title`, and a concise `description` explaining what it does. Supply the optional `url` when a repository, demo, or case study is ready.
3. Arrange the records in the desired reading order and run the checks above.

Adding the first record displays Selected Projects, enables its navigation link, and redirects Explore Work to the board. Cards without a URL display their title as plain text. With an empty project list, Explore Work points to Experience, or About if the timeline is also empty.
