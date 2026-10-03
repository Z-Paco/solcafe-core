This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Copy `.env.example` to `.env.local` and fill the two keys from the Supabase dashboard:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

Useful commands:

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Correctness checks

There is currently no Jest suite (test deps were pruned — see scope note below).
Fastest correctness signal is:

```bash
npm run lint
npm run typecheck
```

The only live API route is `POST /api/extract-metadata` (URL → Open Graph scrape,
used by the News editor). Former `api/posts` and `api/profile` routes were removed —
pages query Supabase directly.

---

# SolCafe CSS Architecture

This document outlines the CSS organization for the SolCafe project.

## Folder Structure

- `globals.css`: Global variables, resets, and utility classes
- `components/`: Styles for reusable UI components
- `layouts/`: Page layout styles
- `pages/`: Page-specific styles
  - `content/`: Content type specific styles

## Import Strategy

- Global components (header, footer, buttons) are imported in the root layout
- Page-specific styles are imported in their respective page components

## Naming Conventions

We follow a component-based approach with descriptive class names:

- `.component-name`: Base component
- `.component-name__element`: Element within component
- `.component-name--modifier`: Variant of component

## CSS Variables

Our theme is controlled via CSS variables defined in `globals.css`.
This allows for consistent styling and easier theme changes.

## Adding New Styles

1. Identify which category your styles belong to
2. Use the appropriate existing file or create a new one
3. Follow the established naming conventions
4. Import the CSS file where needed
