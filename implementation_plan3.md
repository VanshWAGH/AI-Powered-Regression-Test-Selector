# RTS Frontend — Premium UI Overhaul & Full Product Build

## Problem Description

The current frontend is a bare scaffold: a basic sign-in page, a dashboard with 3 hardcoded stat cards, and a sidebar with placeholder navigation. All other routes (Repositories, Merge Requests, Analytics, Settings) are missing. The UI uses plain zinc colors with no visual distinction — it looks like a raw prototype, not a production product.

**Goal**: Transform this into a fully-functional, visually stunning product dashboard that connects to all 7 backend API endpoints, with premium animations, glassmorphic effects, 3D elements, and rich data visualizations.

## Tech Stack (Existing)

- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI Library**: shadcn/ui (base-nova style) + Tailwind CSS 4
- **Charts**: Recharts (already installed)
- **Icons**: Lucide React
- **Auth**: NextAuth.js (credentials provider, mock)
- **Fonts**: Outfit + Geist

### New Dependencies to Add

| Package | Purpose |
|---------|---------|
| `framer-motion` | Premium page/component animations, 3D transforms, spring physics |
| `@react-three/fiber` + `@react-three/drei` | 3D animated hero/background elements (particle fields, glowing orbs) |
| `three` | WebGL engine for 3D scenes |
| `react-countup` | Animated number counters for KPI cards |
| `clsx` | Conditional className utility (complement to `cn`) |

> [!IMPORTANT]
> We keep **shadcn/ui** as the component foundation (Cards, Tables, Dialogs, Buttons, Badges, Tabs, Tooltips, Progress, Sheets, etc.) and enhance everything with Framer Motion animations and a custom glassmorphic design system. No component library is being replaced.

---

## Proposed Changes

### Phase 1: Design System & Global Enhancements

#### [MODIFY] [globals.css](file:///d:/Project/RTS/rts-frontend/app/globals.css)
- Add vibrant accent color palette: neon cyan/blue primary, purple secondary, emerald success, amber warning
- Add glassmorphism utility classes (`glass-card`, `glass-panel`, `glass-glow`)
- Add gradient text utilities, animated gradient borders
- Add custom scrollbar styling
- Add mesh gradient background animation keyframes
- Add glow/pulse animation keyframes for interactive elements

#### [MODIFY] [layout.tsx](file:///d:/Project/RTS/rts-frontend/app/layout.tsx)
- Update metadata with rich SEO (title template, description, keywords)
- Add Framer Motion `AnimatePresence` wrapper

#### [NEW] `components/ui/animated-counter.tsx`
- Animated number counter component using `react-countup` for KPI stats

#### [NEW] `components/ui/glass-card.tsx`
- Premium glassmorphic card with gradient border, hover glow, depth shadow

#### [NEW] `components/ui/status-badge.tsx`
- Contextual status indicator with pulse animation (CONNECTED/PENDING/FAILED/OPENED/MERGED/CLOSED)

#### [NEW] `components/ui/page-header.tsx`
- Reusable page header with animated gradient title, breadcrumbs, action buttons

#### [NEW] `components/ui/loading-skeleton.tsx`
- Animated shimmer loading states for all data-fetching views

#### [NEW] `components/ui/empty-state.tsx`
- Beautiful empty states with illustrations for when no data is available

#### [NEW] `components/three-scene.tsx`
- 3D animated particle field / floating orbs background using React Three Fiber
- Renders behind the sign-in page and as a subtle dashboard accent

---

### Phase 2: Enhanced Sidebar & Navigation

#### [MODIFY] [sidebar.tsx](file:///d:/Project/RTS/rts-frontend/components/sidebar.tsx)
- Complete redesign with glassmorphic background
- Animated active state indicator (sliding pill)
- Collapsible sidebar with smooth width animation
- User avatar section at bottom with session info
- Notification dot indicators on nav items
- Animated logo with hover glow effect
- Keyboard shortcut hints on nav items
- Repository selector dropdown at top (for multi-repo context)

---

### Phase 3: Sign-In Page — Premium Experience

#### [MODIFY] [signin/page.tsx](file:///d:/Project/RTS/rts-frontend/app/auth/signin/page.tsx)
- Full-screen 3D animated background (particle field or mesh gradient)
- Centered glassmorphic sign-in card with depth
- Animated form fields with focus glow transitions
- Loading spinner on sign-in button
- Logo animation on mount
- Gradient text for headings

---

### Phase 4: Dashboard — KPI Hub

#### [MODIFY] [dashboard/page.tsx](file:///d:/Project/RTS/rts-frontend/app/(dashboard)/dashboard/page.tsx)
- Complete rebuild as the product's command center
- **KPI Row**: 4 premium glass cards with animated counters — Total Time Saved, Average Recall, Test Reduction %, Pipelines Evaluated
  - Each card has: icon with gradient glow, animated number, trend indicator (↑/↓), sparkline mini-chart
- **Charts Section**: 
  - Recall trend over time (Area chart with gradient fill)
  - Test reduction rate per MR (Bar chart)
  - Time saved weekly (Line chart)
- **Recent Activity Feed**: Latest MRs, recommendations, evaluations as a timeline
- **Quick Actions**: "Add Repository", "View Latest MR" shortcut buttons
- All data fetched from: `/api/v1/repositories`, `/api/v1/evaluations/repositories/{id}/stats`
- Stagger-animated mount for cards/sections

---

### Phase 5: Repositories Page — Full CRUD

#### [NEW] `app/(dashboard)/repositories/page.tsx`
- Grid/List toggle view of all repositories
- Each repo card shows: name, GitLab URL, build system badge, connection status (animated badge), last synced time
- Hover effect: card lifts with glow, shows quick-action buttons (Validate, Sync, Delete)
- Animated empty state when no repos exist
- Calls: `GET /api/v1/repositories`

#### [NEW] `app/(dashboard)/repositories/[id]/page.tsx`
- Repository detail page with tabs: Overview, Merge Requests, Coverage, Settings
- Overview tab: repo metadata + MR count + evaluation stats
- Merge Requests tab: list of MRs for this repo
- Calls: `GET /api/v1/repositories/{id}`, `GET /api/v1/merge-requests?repositoryId={id}`

#### [NEW] `components/add-repository-dialog.tsx`
- shadcn Dialog with multi-step form:
  1. GitLab URL + Project ID
  2. Access Token (with eye-toggle visibility)
  3. Build System selection (animated toggle)
  4. Review & Submit
- Calls: `POST /api/v1/repositories`
- Success animation on completion

---

### Phase 6: Merge Requests Page

#### [NEW] `app/(dashboard)/merge-requests/page.tsx`
- Filterable table/list of all MRs (across repos or per-repo via dropdown)
- Columns: MR title, Author, Source→Target branch, State badge, Date
- Search/filter by state (OPENED/MERGED/CLOSED), author, branch
- Row click → navigates to MR detail
- Calls: `GET /api/v1/merge-requests?repositoryId={id}`

#### [NEW] `app/(dashboard)/merge-requests/[id]/page.tsx`
- MR detail page with:
  - Header: MR title, state badge, GitLab link button, branch info
  - **Recommendation Panel**: If recommendation exists, show ranked tests with:
    - Signal breakdown radar/bar chart per test
    - Expandable cards showing `signalBreakdown` (Code Impact, Failure History, Coverage Overlap scores)
    - Test reduction donut chart
    - Estimated time savings progress bar
    - Maven/Gradle selector copy-to-clipboard
  - "Generate Recommendation" button if none exists
- Calls: `GET /api/v1/merge-requests/{id}`, `POST /api/v1/recommendations/merge-requests/{id}`

---

### Phase 7: Analytics Page

#### [NEW] `app/(dashboard)/analytics/page.tsx`
- Premium analytics dashboard with:
  - **Hero KPIs**: Total evaluations, Average recall, Average precision, Total time saved
  - **Recall Over Time**: Large area chart (Recharts) with gradient fill showing recall % per evaluation
  - **Time Saved Trend**: Bar chart showing cumulative time saved per week
  - **Test Reduction Breakdown**: Stacked bar showing total vs selected tests per evaluation
  - **Missed Failures Tracker**: Alert-style section highlighting any evals where recall < 100%
  - Date range selector
  - Repository filter dropdown
- Calls: `GET /api/v1/evaluations/repositories/{id}`, `GET /api/v1/evaluations/repositories/{id}/stats`

---

### Phase 8: Settings Page

#### [NEW] `app/(dashboard)/settings/page.tsx`
- Tabbed settings page:
  - **Profile**: View session info (from NextAuth)
  - **API Configuration**: Backend URL, API key management
  - **Preferences**: Theme selection, notification settings
  - **About**: App version, links to docs

---

### Phase 9: API Layer & Types

#### [MODIFY] [api.ts](file:///d:/Project/RTS/rts-frontend/lib/api.ts)
- Add typed API functions for every backend endpoint
- Add error handling with toast notifications
- Add loading state management helpers

#### [NEW] `lib/types.ts`
- Complete TypeScript interfaces matching all backend DTOs:
  - `Repository`, `RepositoryResponse`, `CreateRepositoryRequest`, `ValidationResult`
  - `MergeRequest`, `MergeRequestResponse`
  - `TestRecommendation`, `RankedTest`
  - `RecommendationEvaluation`, `AggregateStats`

#### [NEW] `hooks/use-repositories.ts`
- Custom hooks wrapping API calls with loading/error states

#### [NEW] `hooks/use-merge-requests.ts`
- MR data fetching hooks

#### [NEW] `hooks/use-analytics.ts`
- Analytics/evaluation data hooks

---

### Phase 10: Dashboard Layout Enhancement

#### [MODIFY] [(dashboard)/layout.tsx](file:///d:/Project/RTS/rts-frontend/app/(dashboard)/layout.tsx)
- Remove hard NextAuth session check (make it optional for dev, keep for prod)
- Add animated page transitions via Framer Motion `AnimatePresence`
- Add top bar with: search command (shadcn Command), notification bell, user menu dropdown
- Add breadcrumb trail

---

## Open Questions

> [!IMPORTANT]
> 1. **Authentication**: The current setup requires login (admin/password). Should we keep this for the full build, or remove auth entirely for development speed and add it back later?
> 2. **Mock Data vs Live API**: Since the backend may not be running during frontend development, should I use realistic mock data that matches the backend DTOs exactly, so the UI works standalone but can be switched to live API via a flag?
> 3. **3D Complexity**: The plan includes React Three Fiber for 3D particle backgrounds on the sign-in page. This adds ~200KB to the bundle. Should we include it, or stick with pure CSS animated gradients which are lighter?

---

## Verification Plan

### Manual Verification
- Run `npm run dev` and verify:
  - Sign-in page renders with premium design and animations
  - Dashboard loads with animated KPI cards and charts  
  - Sidebar navigation works across all pages
  - Repositories page allows adding/viewing/managing repos
  - Merge Requests page lists and filters MRs
  - MR detail page shows recommendation breakdown
  - Analytics page renders all chart types
  - Settings page renders with tabbed interface
  - All pages have smooth page transitions
  - Responsive layout works on tablet/mobile viewports
  - 60fps animations (no jank)

### Build Verification
- Run `npm run build` to verify no TypeScript errors and successful production build
