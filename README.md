# Releases

Pseudo-repo for holding [releases](https://download.honeyplayer.com) of the [Honey Player](https://honeyplayer.com) desktop app and [hosting](https://www.netlify.com/with/nextjs/) the latest release with updater json

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

Everytime a new build is pushed to the private repo, the workflow in this PR is triggered, which clones the repo and build bundle in 3 different platforms, creating a pre-release. Tech-savy users can directly use the pre-release, else someone from the team check the build, updates the description and then releases it for everyone to use. Anyone can download the new version directly, else if a previous version is installed will get an update notification within the app.

## Deploy to Netlify

The easiest way to deploy this Next.js app is to use the [Netlify](https://www.netlify.com/)
