This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🧪 API Testing Guide

### How Testing Works

- Each API route (like `/api/posts`, `/api/profile`, `/api/contributions`) has a corresponding test file in the `__tests__` folder.
- Tests import the handler functions (e.g., `GET`, `POST`) directly and use mock requests/responses.
- Supabase and Next.js cookies are mocked for isolation—no real DB or HTTP calls are made.
- Tests are run with **Jest** (and Babel for ES module support).
- Test environment variables are loaded from `.env.test` (or `.env` if you copy it).

### Running the Tests

```bash
npm test
```

### Writing and Organizing Tests

- Place new test files in the `__tests__` folder (e.g., `__tests__/api-posts.tests.js`).
- Import your handler and test its logic with different mock requests.
- Use mocks to simulate DB errors, missing fields, and authentication scenarios.
- Add tests for:
  - Success cases (200/201)
  - Validation errors (400)
  - Unauthorized (401)
  - DB errors (500)

### Example Test

```js
import { POST } from "../src/app/api/posts/route";

test("POST /api/posts creates a post", async () => {
  const req = {
    json: async () => ({
      user_id: "11111111-1111-1111-1111-111111111111",
      title: "Test Post",
      description: "This is a test post.",
      image_url: "https://example.com/image.jpg",
    }),
    method: "POST",
  };
  const response = await POST(req);
  expect(response.status).toBe(201);
});
```

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
