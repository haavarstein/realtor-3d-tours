# Realtor3D

A mobile-first SaaS web app that turns a quick property walkthrough video into a shareable 3D virtual tour for real-estate brokers.

```
record on phone  →  upload  →  3D tour link
```

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS 4** + **shadcn/ui**
- **Vercel Blob** for video storage
- **SuperSplat** viewer (iframed for MVP — pluggable for real 3DGS output)
- **lucide-react**, **sonner** for icons and toasts
- **TypeScript**, ESLint

## Pages

| Route          | What it does                                                   |
| -------------- | -------------------------------------------------------------- |
| `/`            | Landing — hero, how it works, benefits, testimonials, CTA      |
| `/upload`      | Big mobile-friendly upload button + progress + processing UI   |
| `/tour/[id]`   | 3D tour viewer + shareable link + embed code                   |
| `/dashboard`   | Stub list of recent tours (localStorage-backed for the MVP)    |
| `/api/upload`  | Route handler that pushes the video to Vercel Blob if configured |

## Run locally

Requires Node 20+ (we tested on Node 24 LTS).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional environment variables

Create `.env.local`:

```bash
# Required to actually persist uploaded videos. Without it, uploads are accepted
# but discarded — fine for demoing the UI flow.
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Optional override for the SuperSplat viewer URL embedded on tour pages.
# Defaults to https://superspl.at/.
NEXT_PUBLIC_DEMO_SPLAT_URL=https://superspl.at/view?id=YOUR_SPLAT_ID
```

Get a Blob token at https://vercel.com/dashboard → Storage → Create Blob store.

## How the MVP processing works

The upload route stores the video (via Vercel Blob, when a token is set), then the
client shows a ~35-second realistic processing animation and finally redirects to
`/tour/[id]`, which iframes the SuperSplat viewer.

To swap in real 3D Gaussian Splatting:

1. Replace the body of `src/app/api/upload/route.ts` with a call to your processing
   pipeline (Luma AI, RunPod, a Modal job, etc.).
2. Persist `{ tourId, splatUrl }` somewhere durable (KV / DB).
3. Pass the resulting `splatUrl` into `TourViewer` and update the iframe `src`.

## Deploy to Vercel

1. Push to a GitHub repo (already wired up: `haavarstein/realtor-3d-tours`).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add `BLOB_READ_WRITE_TOKEN` (and `NEXT_PUBLIC_DEMO_SPLAT_URL` if you have one)
   to the project's environment variables.
4. Deploy. That's it.

```bash
# Or from the CLI:
npx vercel
npx vercel --prod
```

## Project layout

```
src/
  app/
    api/upload/route.ts      ← upload endpoint (Vercel Blob)
    dashboard/page.tsx       ← stub dashboard
    tour/[id]/page.tsx       ← 3D tour viewer page
    upload/page.tsx          ← upload page wrapper
    layout.tsx, page.tsx     ← root layout + landing page
    globals.css              ← Tailwind 4 + shadcn theme tokens
  components/
    site-header.tsx, site-footer.tsx
    upload-flow.tsx          ← client upload + progress UI
    tour-viewer.tsx          ← SuperSplat iframe + share/embed UI
    tour-list.tsx            ← dashboard list
    ui/                      ← shadcn primitives
  lib/
    tours.ts                 ← localStorage tour store
    utils.ts
```

## What's next

- Real 3DGS pipeline (Luma / RunPod / self-hosted)
- Auth + a real database for tours
- Branded share pages with broker logo + property metadata
- Analytics on tour engagement
