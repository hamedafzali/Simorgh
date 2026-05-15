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

## Recommended Next Priorities

1. polish remaining rough app screens for consistency
2. keep testing backend feature toggles end to end
3. tighten the release model when moving from MVP iteration to production rollout
4. complete a final manual QA pass on mobile navigation, sync, and guarded routes
