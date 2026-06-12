# Simorgh - Project Summary

## Overview

Simorgh is a mobile-first support app for Iranians living abroad, starting with Germany. It combines offline language-learning content with practical settlement tools such as checklists, deadlines, forms, emergency information, phrasebook help, and country-specific community guidance.

The current product is best described as:
- Germany-first MVP
- offline-first mobile app
- backend-managed content and feature rollout
- admin-driven SQLite/database operations

## Current Architecture

### Mobile app
- Stack: Expo, React Native, Expo Router, TypeScript
- Location: `/Users/hamed.afzali/Desktop/Repos/Simorgh/app`
- Active route tree: `/Users/hamed.afzali/Desktop/Repos/Simorgh/app/app`
- Local storage:
  - SQLite for learning content and version metadata
  - local JSON storage for lightweight app state such as feature flags

### Backend API
- Stack: Node.js, Express, MongoDB/Mongoose
- Location: `/Users/hamed.afzali/Desktop/Repos/Simorgh/backend`
- Purpose:
  - serves content for words, flashcards, exams
  - exposes database version/update endpoints
  - powers admin database operations

### Admin UI
- Stack: React
- Location: `/Users/hamed.afzali/Desktop/Repos/Simorgh/admin`
- Purpose:
  - generate SQLite mobile database artifacts
  - manage database artifacts/backups
  - inspect generated SQLite content
  - manage feature flags and admin settings

## Run Model

### Backend + admin
Use Docker Compose from repo root:

```bash
cd /Users/hamed.afzali/Desktop/Repos/Simorgh
docker compose up -d --build
```

Services:
- Admin UI: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- MongoDB: `localhost:27017`

### Mobile app
Run Expo from the app folder:

```bash
cd /Users/hamed.afzali/Desktop/Repos/Simorgh/app
npx expo start
```

For physical-device testing, set:

```env
EXPO_PUBLIC_API_BASE_URL=http://<your-lan-ip>:3001/api
```

in:
- `/Users/hamed.afzali/Desktop/Repos/Simorgh/app/.env`

## Implemented Product Areas

### Learning
- vocabulary browsing
- flashcards
- practice
- exams
- local learning stats from SQLite

### Settlement support
- country starter packs
- checklist
- deadlines
- documents tracker
- forms helper
- emergency kit
- phrasebook
- reminders
- housing safety
- school enrollment guidance
- tax basics
- support resources
- services, guides, locations, timeline

### Jobs (live data)
- live job search backed by the official Bundesagentur für Arbeit API
- proxied through the backend (`/api/jobs`) with a 10-minute cache
- tap-through to the official arbeitsagentur.de application page
- offline fallback to the last cached default search

### Analytics (self-hosted, anonymous)
- app queues events locally and flushes batches to `/api/analytics/events`
- random device id only — no accounts, no PII
- crash reports via the app ErrorBoundary (`app_error` events)
- admin summary at `/api/admin/analytics/summary?days=30` (JWT-protected)

### Admin operations
- SQLite generation from backend data
- automatic seeding when source data is empty
- artifact listing/download/delete/restore
- artifact content viewer
- persisted admin settings and script registry
- feature flag controls

## Feature Rollout Model

The app now supports backend-controlled feature availability.

How it works:
- feature flags are stored in backend admin settings
- app receives them during database version sync
- app stores them locally
- Home, Community, main tab screens, and direct feature routes use those flags

Current behavior:
- the app ships with baked-in first-run defaults (Germany features on, chat off, jobs on) so it is fully usable before its first backend sync
- if no published database version overrides flags, admin settings act as the live source of truth
- this is suitable for MVP iteration
- for stricter release control later, published database versions should become the only app-facing source

## Current State

What is strong now:
- app route tree is cleaned up to one active Expo Router tree
- TypeScript passes for the mobile app package
- backend/admin database workflow is operational
- sync works when the app points to the correct backend LAN IP
- feature gating is active across the main user flows

What is still not final:
- some screens still need UI consistency polish
- docs are being updated to match reality
- published-version release discipline is not yet strict by design
- deeper QA is still needed before calling the app release-ready

## Production Notes

- backend env vars for prod: `MONGODB_URI`, `APP_API_KEY`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS` (see `render.yaml`)
- app env vars: `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_API_KEY` (must match `APP_API_KEY`)
- privacy policy is served at `/privacy` (required for store listings)
- chat remains disabled (no real backend); the only remaining mock-free gap

## Recommended Next Priorities

1. deploy backend (Render + MongoDB Atlas) and point the app at the prod URL
2. EAS preview build → distribute to 15–25 beta testers from the Iranian community in Germany
3. watch `/api/admin/analytics/summary` and iterate on what testers actually use
4. move remaining hardcoded content (germany-data, countries-data) into the backend CMS
