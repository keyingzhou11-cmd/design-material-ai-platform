# Design Inspiration Platform

AI-powered design inspiration collection and analysis platform.

## Tech Stack

- **Next.js 14** — App Router, TypeScript
- **TailwindCSS** — Premium minimal design system
- **Supabase** — Database, auth, storage
- **OpenAI API** — Image analysis & recommendations
- **Fabric.js** — Moodboard canvas

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase and OpenAI credentials
# Run supabase/schema.sql in your Supabase SQL editor
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Daily AI recommendations, stats, recent materials |
| `/library` | Pinterest-style material library with upload & filters |
| `/workspace/[id]` | Moodboard canvas with drag, resize, rotate |
| `/analysis` | AI image analysis panel |
| `/projects` | Project management |
| `/settings` | User preferences |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full schema and component map.
