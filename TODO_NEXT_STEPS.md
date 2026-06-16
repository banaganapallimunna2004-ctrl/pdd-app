## Next steps (after OTP + theme verification)

### 1) Fix OTP login UI mismatch
- Ensure routing renders `frontend/src/pages/Login.jsx` (OTP-enabled) instead of the mock login.
- Remove/replace any duplicate `Login.jsx` files in the project root if they exist.

### 2) Cream/light theme conversion
- Update `frontend/src/index.css` and global wrapper in `frontend/src/App.jsx` to light cream theme.
- Normalize shared components (cards, buttons, text colors) so pages remain readable.

### 3) Dashboard redesign
- Rewrite `frontend/src/pages/Dashboard.jsx` layout to match new light theme.
- Improve typography, spacing, and card hierarchy.

### 4) OTP UX hardening
- Update `frontend/src/pages/Login.jsx` to:
  - show resend cooldown timer
  - show backend error details
  - show `devOtp` only in non-production (or add a toggle for testing)

### 5) Testing
- Run `npm run build` and start Vite dev server again.
- Validate OTP request/verify flow and navigation to `/dashboard`.

