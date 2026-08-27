# End-to-End (E2E) Selenium Testing Setup

This folder contains Selenium + end-to-end test runner utilities for the web app.

## 1) Prerequisites
- Node.js installed
- Chrome installed (or update config to use another browser)
- Selenium server handled by `selenium-webdriver` (no extra global install required)

## 2) Install test deps (in `frontend/`)
```powershell
cd c:/Users/Banaganapalli/Desktop/AgroAI-Precision-Crop-Detection/apps/web/crop-disease-system/frontend
npm i -D selenium-webdriver chromedriver-exec
```

## 3) Configure environment variables
Create/update `.env` in `frontend/` (or use existing Vite env).

Recommended:
- `VITE_APP_BASE_URL=http://localhost:5173`
- `VITE_API_BASE_URL=http://localhost:5000/api`

## 4) Run
From `frontend/`:
```powershell
node tests/e2e/runE2E.mjs
```

## 5) Reports
- HTML report saved under `frontend/tests/reports/`
- Test artifacts: screenshots under `frontend/tests/artifacts/screenshots/`

