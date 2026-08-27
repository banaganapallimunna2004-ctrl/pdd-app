# TODO_NEXT_STEPS (Login Authentication)

- [ ] Improve login UI to surface backend failure reason + status (403 email verification, 400/429 OTP issues).
- [ ] Add redirection to /verify when backend returns 403 for unverified users (email flow).
- [ ] (Optional) Make AuthContext attempt refresh-token exchange on 401 from /auth/me.
- [ ] Test login flows:
  - Email login (verified user)
  - Email login (unverified user)
  - Phone OTP request + verify
- [ ] Confirm ProtectedRoute allows access after successful login.

