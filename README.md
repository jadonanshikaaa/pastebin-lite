# Pastebin Lite

A small Pastebin-like application built with Next.js and Prisma/Postgres. Users can create text pastes with optional time-based expiry (TTL) and view-count limits, and share them via URLs.

## How to run the app locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your database: Ensure you have a PostgreSQL database and set the `DATABASE_URL` environment variable.
4. Run Prisma migrations: `npx prisma migrate dev`
5. Generate Prisma client: `npx prisma generate`
6. Start the development server: `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000) to use the app.

## Persistence Layer

This app uses Prisma ORM with PostgreSQL as the persistence layer. Prisma provides type-safe database access and migrations, ensuring data survives across requests in serverless environments like Vercel.

## Important Design Decisions

- Used Next.js App Router for API routes and pages.
- Implemented atomic view count increments to handle concurrent requests.
- Supported deterministic time testing via `TEST_MODE` and `x-test-now-ms` header.
- Rendered paste content safely using `<pre>` tags to prevent script execution.
- Validated inputs using Zod for type safety and error handling.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
