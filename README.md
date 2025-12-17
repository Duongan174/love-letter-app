This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

You can deploy this app for free on [Vercel](https://vercel.com/). The only requirements are a Vercel account and the environment variables listed below.

### Required environment variables

Add these to a `.env.local` file during local development and to **Project Settings → Environment Variables** in Vercel before deploying:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (Project Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public API key. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for client-side uploads. |
| `CLOUDINARY_API_KEY` | Cloudinary API key (used server-side). |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-side). |

If you use other Supabase tables or services, ensure the anon key has access to them or set up additional service keys as needed.

### One-click deploy via Vercel dashboard

1) Push your code to GitHub, GitLab, or Bitbucket.
2) In the [Vercel dashboard](https://vercel.com/new), import the repository and pick the `work` branch (or your main branch).
3) Set the environment variables above in **Project Settings → Environment Variables**.
4) Keep the default **Framework Preset: Next.js**, **Build Command: `npm run build`**, and **Output Directory: `.next`**.
5) Click **Deploy**. Vercel will build the app and provide a production URL when finished.

### Deploy with Vercel CLI (optional)

1) Install the CLI locally: `npm i -g vercel`.
2) Log in: `vercel login`.
3) From the project root, run `vercel` to create the project and set environment variables when prompted.
4) Run `vercel --prod` to trigger a production deployment at any time.

For more details, see the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).
