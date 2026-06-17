# TODO - Fix OTP not coming

## Step 1: Identify OTP UI + route
- [x] Checked backend OTP endpoints exist in `backend/src/controllers/authController.js`
- [x] Checked current `frontend/src/pages/Login.jsx` is email/password only (no OTP)
- [x] Checked `frontend/src/App.jsx` routes: `/` renders `Login`.

## Step 2: Implement phone OTP UI where needed
- [ ] Replace or update `frontend/src/pages/Login.jsx` to support `?mode=phone` and call:
  - `authService.requestPhoneOtp({ phone })`
  - `authService.verifyPhoneOtp({ phone, otp })`
- [ ] Ensure UI shows `devOtp` when backend is in non-production.

## Step 3: Validate request payloads
- [ ] Confirm frontend sends correct JSON body keys expected by backend (`phone`, `otp`).

## Step 4: Test locally
- [ ] Start backend + frontend
- [ ] Register with phone -> redirect to login with `mode=phone`
- [ ] Request OTP and verify OTP; confirm SMS/Twilio devOtp behavior.

