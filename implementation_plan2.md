# RTS Frontend UI Implementation Plan

## Problem Description
Now that the core AI-Powered Regression Test Selector backend is fully complete and operational, we need a premium, dynamic web application to visualize the system's output. The dashboard must allow developers to register repositories, view historical test metrics, and inspect the precise reasons behind a specific test recommendation for a given Merge Request.

## Tech Stack
Based on modern web application best practices:
- **Framework**: Vite + React (TypeScript) for a lightning-fast Single Page Application (SPA).
- **Styling**: Vanilla CSS utilizing CSS Variables (Custom Properties) to build a bespoke, premium design system (Glassmorphism, vibrant gradients, dark mode).
- **Routing**: React Router for client-side navigation.
- **State Management & Fetching**: React Query (or native `fetch` + Context) for interacting with the `localhost:8080/api/v1` backend endpoints.

> [!IMPORTANT] 
> We will specifically avoid generic component libraries or Tailwind CSS (unless requested) in favor of writing highly-optimized, dynamic Vanilla CSS to ensure the UI feels visually stunning and completely bespoke.

## Proposed Phases

---

### Phase 1: Foundation & Design System Setup
- Initialize the `rts-frontend` repository using `npx -y create-vite-app@latest ./rts-frontend --template react-ts`.
- Establish the core typography (e.g., Google Font 'Inter' or 'Outfit').
- Create the global `index.css` defining the premium design tokens (HSL colors, sleek dark mode palette, shadow depths, glassmorphic utility classes).
- Set up a standard Layout component with a dynamic, collapsible sidebar navigation.

### Phase 2: Repository & System Dashboard
- **Dashboard View**: Displays high-level backend aggregates (Total Time Saved, Average Recall, Average Precision) by calling `/api/v1/evaluations/repositories/{id}/stats`.
- **Repository Management**: A visually engaging card-grid to view connected repositories (`/api/v1/repositories`).
- Include a sleek modal to add new repositories and generate their webhook secrets.

### Phase 3: Merge Requests & Recommendations Explorer
- **MR List**: A timeline or table view of recent GitLab Merge Requests (`/api/v1/merge-requests?repositoryId={id}`).
- **Recommendation Deep-Dive**: Clicking an MR opens a detailed view showing the backend's `TestRecommendation` object.
  - A visual breakdown of the ranked tests.
  - Interactive tooltips or expanded cards showing the `signalBreakdown` (Code Impact, Failure History, Coverage Overlap) so users understand *why* a test was recommended.
  - A dynamic progress bar indicating estimated CI time reduction vs total time.

### Phase 4: CI Pipeline Evaluation Analytics
- A dedicated analytics page visualizing historical `pipeline_runs` and `recommendation_evaluations`.
- Beautiful micro-animations and CSS charts to track whether the model missed any failures (Recall tracking) over time.

---

## Open Questions

> [!WARNING]
> Please review and answer the following before we begin:

1. **Tech Stack Approval**: Are you comfortable with **Vite + React + TypeScript** and bespoke **Vanilla CSS** for the frontend, or would you prefer a different stack (like Next.js or raw HTML/JS)?
2. **Design Theme**: The plan assumes a modern **sleek dark mode** aesthetic with glassmorphic elements and vibrant accents (e.g., neon blue/purple). Does this fit your vision, or do you prefer a clean, minimalist light theme?
3. **Location**: I will initialize the UI in `d:\Project\RTS\rts-frontend`. Does this directory structure work for you?

## Verification Plan

### Manual Verification
- Launch the Vite dev server (`npm run dev`) alongside the Spring Boot backend.
- Visually verify that the dashboard loads, connects to the local backend APIs without CORS issues, and dynamically updates when a repository is added.
- Ensure animations and transitions feel fluid at 60fps.
