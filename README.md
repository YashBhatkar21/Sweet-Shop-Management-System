# Sweet Shop Management System

Backend (Spring Boot) for managing sweets, inventory, and auth (JWT). Java 17, MySQL, JPA.


## Frontend (React + Vite) Quickstart

Requirements: Node 18+

1. Start backend (port 8081) and ensure DB is reachable.
2. In a new terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App will be at http://localhost:5173

Environment:
- Backend base URL is hardcoded to http://localhost:8081 in `frontend/src/App.jsx` (API_BASE). Adjust if needed.
- CORS is enabled for http://localhost:5173 in backend `SecurityConfig`.

Features implemented:
- Login/Register with JWT
- Sweets dashboard with search, filter, purchase
- Admin: add, update, delete, restock


