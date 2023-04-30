# releases

Pseudo-repo for holding releases of the [Host Player](https://honeyplayer.com) desktop app and [hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/) the latest release with updater json

## Getting Started

First, run the development server:

```bash
pnpm i
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/release/latest](http://localhost:3000/api/release/latest). This endpoint can be edited in `pages/api/release/latest.ts`.

## Releases

Everything a new build is pushed to the private repo, the workflow in this PR is triggered which clones the repo, build the bundle in 3 different platform and releases a pre-release

## Deploy on Cloudflare

The easiest way to deploy this Next.js app is to use the [Cloudflare Platform](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#deploy-with-cloudflare-pages)
