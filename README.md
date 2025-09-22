# SSD Project — Securing the App

## Team
- Nuwani Fonseka — OAuth (Google) + DoS (ReDoS) fix
- Hasindu — SQL Injection, Dependency updates
- Sadeesha — CSRF, Hardcoded URL removal
- Tiny — Sensitive Data Exposure, (Rate Limiting moved to Tiny)

## Original project
- Source (pre-fixes): <PUT LINK>  
  *Note:* Original commit history predates semester start. (See assignment brief.) :contentReference[oaicite:0]{index=0}

## Secured project
- Fork / modified code (with fixes): <PUT LINK TO YOUR REPO/BRANCH>  
- Key branches:
  - `main` — stable, after fixes
  - `nuwani-Oauth` — OAuth + DoS work

## My vulnerabilities (Nuwani)
1) **DoS (ReDoS) risk** in tour search  
   - **Before:** `new RegExp(req.query.city, "i")` built from user input  
   - **After:** Removed dynamic regex. Added input validation and **MongoDB collation** (`strength: 2`) for case-insensitive match.  
   - **Endpoints:**  
     - `GET /api/v1/tours/search?city=Colombo&distance=10&maxGroupSize=5`  
     - `GET /api/v1/tours/featured`  
     - `GET /api/v1/tours/count`
   - **Files touched:**  
     - `mainapp/backend/controllers/tourController.js`  
     - `mainapp/backend/models/Tour.js` (index: `tourSchema.index({ city: 1 }, { collation: { locale: "en", strength: 2 } })`)  
     - `mainapp/backend/routes/tour.js` (route order hardened)

2) **OAuth 2.0 (Google) login**  
   - Added OAuth flow with popup-aware route handlers; state parameter preserved; tokens handled server-side.
   - **Files:** `eventapp/backend/server.js`, `frontend/src/pages/Login.js`, `frontend/src/pages/SsoHandler.js`, etc.

## How to run
```bash
cd mainapp/backend
cp .env.example .env
# .env requires:
# PORT=5003
# MONGO_URI=mongodb+srv://<...>

npm install
npm start
