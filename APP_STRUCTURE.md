Simorgh German Learning App - Structure
Database Architecture
Backend: MongoDB (content management, user data)
Mobile: SQLite (offline storage, local cache) implemented
Sync: API-based synchronization
Key Components
Backend API (Express + MongoDB)

- Admin Panel (React + Ant Design) - served by backend server
  Mobile App (React Native + SQLite)
  Sync Service (data synchronization)
  Project Structure
- app/ - React Native mobile application
- backend/ - Unified Node.js/Express backend
  - admin/ - React admin panel (served as static files)
  - src/ - API server code
  - database/ - Database models and seeds
  - services/ - Backend services
    Usage
- Start backend: cd backend && npm run dev
- Build admin: cd backend && npm run admin:build
- Access API: http://localhost:3001/api
- Access Admin: http://localhost:3001/admin
Next Steps
  Finish SQLite sync/update flow
  Add database content management to admin panel
  Create robust sync service between MongoDB and SQLite
