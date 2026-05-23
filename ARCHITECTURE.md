# Design Inspiration Platform — Architecture

## 1. Folder Structure

```
素材网站/
├── ARCHITECTURE.md
├── README.md
├── .env.local.example
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── supabase/
│   └── schema.sql
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, fonts, metadata
│   │   ├── page.tsx                   # Redirect → /dashboard
│   │   ├── globals.css                # Design tokens, Tailwind base
│   │   ├── (app)/
│   │   │   ├── layout.tsx             # App shell (sidebar + main)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── library/page.tsx
│   │   │   ├── workspace/[id]/page.tsx
│   │   │   ├── analysis/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── materials/route.ts
│   │       ├── materials/[id]/route.ts
│   │       ├── upload/route.ts
│   │       ├── analyze/route.ts
│   │       ├── recommendations/route.ts
│   │       ├── canvas/[id]/route.ts
│   │       └── projects/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── materials/
│   │   │   ├── MaterialCard.tsx
│   │   │   ├── MaterialGrid.tsx
│   │   │   ├── MaterialUploader.tsx
│   │   │   ├── MaterialFilters.tsx
│   │   │   └── MaterialDetailSheet.tsx
│   │   ├── moodboard/
│   │   │   ├── MoodboardCanvas.tsx
│   │   │   ├── CanvasToolbar.tsx
│   │   │   └── MaterialTray.tsx
│   │   ├── analysis/
│   │   │   ├── AnalysisPanel.tsx
│   │   │   └── AnalysisResultCard.tsx
│   │   └── dashboard/
│   │       ├── DailyRecommendations.tsx
│   │       ├── RecentMaterials.tsx
│   │       └── StatsOverview.tsx
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   ├── supabase/server.ts
│   │   ├── openai.ts
│   │   ├── fabric/canvas-utils.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useMaterials.ts
│   │   ├── useMoodboard.ts
│   │   └── useDebounce.ts
│   ├── types/
│   │   ├── database.ts
│   │   └── index.ts
│   └── store/
│       └── moodboard-store.ts
```

## 2. Database Schema

See `supabase/schema.sql` for full DDL with RLS policies.

| Table | Purpose |
|-------|---------|
| `profiles` | User profile (extends Supabase auth) |
| `categories` | Material categories (Typography, Color, Layout…) |
| `tags` | Free-form tags |
| `materials` | Uploaded / saved design assets |
| `material_tags` | Many-to-many material ↔ tag |
| `projects` | User design projects |
| `moodboards` | Canvas instances per project |
| `canvas_states` | Serialized Fabric.js JSON per moodboard |
| `ai_analyses` | OpenAI analysis results per material |
| `daily_recommendations` | Cached daily AI picks |

## 3. Component Architecture

```
AppShell
├── Sidebar (nav links, user avatar)
└── Main
    ├── PageHeader (title, actions)
    └── Page Content
        ├── Dashboard → StatsOverview + DailyRecommendations + RecentMaterials
        ├── Library → MaterialFilters + MaterialGrid + MaterialUploader
        ├── Workspace → MaterialTray | MoodboardCanvas + CanvasToolbar
        ├── Analysis → AnalysisPanel + AnalysisResultCard[]
        ├── Projects → Project cards grid
        └── Settings → Profile / API keys / Preferences forms
```

**Data flow:**
- Materials: Supabase Storage (images) + `materials` table (metadata)
- Canvas: Fabric.js in browser → debounced save → `canvas_states` via API
- AI: `/api/analyze` → OpenAI Vision → `ai_analyses` table
- Recommendations: `/api/recommendations` → daily cron or on-demand

## 4. UI Layout

**Design tokens:** beige `#F5F0EB`, black `#1A1A1A`, orange `#E85D04`, warm gray borders.

| Page | Layout |
|------|--------|
| **Dashboard** | 3 stat cards top → 2-column: daily recs (left 2/3) + recent uploads (right 1/3) |
| **Library** | Sticky filter bar → masonry Pinterest grid → floating upload FAB |
| **Workspace** | Split: left tray (280px) + right canvas (flex-1) with toolbar top |
| **Analysis** | Left: material picker grid → Right: analysis results panel |
| **Projects** | Card grid with cover thumbnail, name, date, open workspace CTA |
| **Settings** | Single column form sections with dividers |

**Navigation:** Fixed left sidebar (240px), icon + label, orange active indicator.

## 5. Implementation Plan

| Phase | Tasks |
|-------|-------|
| **1. Foundation** | Next.js scaffold, Tailwind tokens, Supabase client, types, AppShell |
| **2. Database** | Run schema.sql, storage bucket, env vars |
| **3. Dashboard** | Stats, mock/real recommendations, recent materials |
| **4. Library** | Upload API, masonry grid, filters, search, tags |
| **5. Workspace** | Fabric.js canvas, tray click-to-add, drag/resize/rotate, save state |
| **6. AI Analysis** | OpenAI Vision API route, analysis UI, link to materials |
| **7. Projects** | CRUD projects, link moodboards, navigation to workspace |
| **8. Settings** | Profile, preferences, API key display |
| **9. Polish** | Loading states, empty states, error boundaries, responsive |
