# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wanna** is a social platform where users share life experiences through AI-guided conversations (interviews). The AI interviewer collects a user's story, then an AI editor transforms it into a structured written narrative. The app is in Spanish (UI copy, prompts, content).

## Commands

- `npm run dev` — Start development server (port 3000)
- `npm run build` — Production build (standalone output for Docker)
- `npm run lint` — ESLint with Next.js core-web-vitals + TypeScript rules
- `npm start` — Start production server

No test framework is configured.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` — Backend API URL (falls back to `https://api.playground.wannna.ai`)
- `ANTHROPIC_API_KEY` — Used by AI SDK server-side routes

## Architecture

**Next.js 16 App Router** with TypeScript and Sass modules (`.module.scss`). Uses `@/*` path alias mapping to project root.

### User Flow (core pages)

1. **`/` (Home)** — Landing page with hero, steps, story examples, FAQs
2. **`/chat`** — AI interview using `@ai-sdk/react` `useChat`. Streams responses from `/api/chat` (Anthropic Claude). When the interview ends (AI outputs trigger phrase), conversation is saved to localStorage and user navigates to register or result
3. **`/register`** — User registration (for unauthenticated users after interview)
4. **`/result`** — Calls `/api/chat/review` to generate structured story from conversation via `streamObject`. Displays title, experience, reflection
5. **`/preview`** — Story preview before publishing
6. **`/visibility`** — Set story visibility settings
7. **`/succeed`** — Post-publish success page with share functionality

### API Routes (`app/api/`)

- **`/api/chat`** — Streams AI interview responses using `streamText` with Anthropic Claude
- **`/api/chat/review`** — Generates structured experience object (`title`, `experience`, `reflection`, `story_valuable`) using `streamObject` with a Zod schema
- **`/api/auth/*`** — Cookie-based auth token management (`set-cookie`, `get-cookie`, `check-auth`, `remove-cookie-token`)

### Key Patterns

- **State management**: React Context (`AppContext`) holds experience data, prompts, auth token, user info, toast state, and color theme. Wraps the entire app via `AppProvider` in root layout
- **Auth flow**: Cookie-stored `authToken` checked via `/api/auth/check-auth` server route. `useAuth` hook in `app/hook/useAuth.ts` manages client-side auth state. Guest users (username starting with `guest-`) are treated as unauthenticated
- **Backend communication**: `services/api.ts` provides `apiService` with `get`/`post`/`put`/`delete` methods that hit `NEXT_PUBLIC_API_BASE_URL`. Auth token passed via Bearer header
- **AI prompts**: Interviewer and editor prompts are fetched from the backend (`/api/v1/landing/interview-ai-configs`). Fallback system prompt in `app/lib/prompt.ts`
- **Styling**: Sass modules with BEM-like naming. Global breakpoints in `app/_breakpoints.scss`. Global styles in `app/globals.scss`. Custom local fonts (Diatype family, Open Sans) loaded via `next/font/local`
- **Layout**: `MainLayout` component conditionally shows Header/Footer and inverts color scheme on `/result` page
- **Docker**: Multi-stage Dockerfile with standalone Next.js output. `docker-compose.yml` for production deployment on port 3000
