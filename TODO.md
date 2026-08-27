# TODO - Frontend professional structure refactor

## Plan approval pending
- [ ] Confirm target folder structure (layouts/routes/components/pages/services/context/store/utils)
- [ ] Identify current file locations and dependencies

## Refactor steps (after approval)
- [ ] Create new folders under `frontend/src/` matching the target structure
- [ ] Move components/pages/context/services into their respective folders
- [ ] Move route guards and animated route wrapper into `routes/` and `layouts/`
- [ ] Update import paths across the app
- [ ] Ensure Vite build passes
- [ ] Smoke test key routes: /, /login, /dashboard, /admin

## Theme update (Agro AI)
- [ ] Unify brand name to **Agro AI** across frontend
- [ ] Beautify cover page (Home) with Agro AI branding
- [ ] Ensure remaining pages use consistent agriculture tone/colors
- [ ] Run frontend build to verify no errors


