# Docker Runbook

This project runs backend API, MongoDB, and admin UI with Docker Compose.

## Services

- `mongo`: MongoDB database
- `backend`: Express API on `http://localhost:3001/api`
- `admin`: React admin UI on `http://localhost:3000`

## Start

```bash
cd /Users/hamed.afzali/Desktop/Repos/Simorgh
docker compose up -d --build
```

## Stop

```bash
docker compose down
```

To remove MongoDB data too:

```bash
docker compose down -v
```

## Mobile App Connection

### iOS simulator
Use either:
- `http://localhost:3001/api`
- or your LAN IP if you want the same config everywhere

### Physical device
Use your current LAN IP in:
- `/Users/hamed.afzali/Desktop/Repos/Simorgh/app/.env`

Example:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.178.94:3001/api
```

Then restart Expo.

## Seed Data

Seed inside the backend container:

```bash
docker compose exec backend node src/seed/runSeed.js
```

## Admin Data Persistence

Docker mounts these host directories:

- SQLite output:
  - `/Users/hamed.afzali/Desktop/Repos/Simorgh/admin/dist/sqlite`
- SQLite artifacts:
  - `/Users/hamed.afzali/Desktop/Repos/Simorgh/admin/dist/sqlite/artifacts`
- persisted admin settings and script state:
  - `/Users/hamed.afzali/Desktop/Repos/Simorgh/admin/dist/admin-data`

## Useful Checks

Check running services:

```bash
docker compose ps
```

Read backend logs:

```bash
docker compose logs --tail=100 backend
```

Read admin logs:

```bash
docker compose logs --tail=100 admin
```

Verify backend endpoint from inside the container:

```bash
docker compose exec backend sh -lc 'wget -qO- http://127.0.0.1:3001/api/database-version/current'
```

## Notes

- If admin or app cannot reach backend, first check the API base URL used by the mobile app.
- A successful Docker container start does not guarantee the app is using the correct backend IP.
- For device testing, the most common failure is a stale LAN IP in `/Users/hamed.afzali/Desktop/Repos/Simorgh/app/.env`.
