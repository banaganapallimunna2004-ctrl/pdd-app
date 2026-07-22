# Web Frontend Security Review Report

**Target:** AgroAI Precision Crop Detection – React/Vite Frontend  
**Overall Risk Rating:** Low Risk (Score: 72/100)  
**Scan Date:** Wed, 22 Jul 2026 05:02:10 GMT

---

## Findings Summary

| ID | Category | File | Title | Severity |
|---|---|---|---|---|
| WEB-001 | Data Storage | `AuthContext.jsx` | PII stored in browser localStorage without encryption | Low |
| WEB-002 | Session Management | `AuthContext.jsx` | No client-side session TTL or idle timeout enforced | Low |
| WEB-003 | HTTP Headers | `index.html / App.jsx` | Missing Content-Security-Policy meta tag in HTML shell | Low |
| WEB-004 | HTTP Headers | `index.html` | X-Frame-Options header not declared to prevent clickjacking | Low |
| WEB-005 | Configuration | `.env / vite.config.js` | Hardcoded localhost API base URL in environment fallback | Low |
| WEB-006 | Dependency | `package.json` | react-icons package includes unused icon sets increasing bundle size | Low |
| WEB-007 | Input Validation | `Login.jsx` | Client-side email validation relies solely on HTML5 type="email" | Low |
| WEB-008 | Error Handling | `Login.jsx / Register.jsx` | Raw server error messages surfaced directly to the end user | Low |
| WEB-009 | External Links | `App.jsx / component files` | External anchor links missing rel="noopener noreferrer" attribute | Low |
| WEB-010 | Accessibility / Security | `index.css / component files` | Form autocomplete not explicitly disabled for sensitive fields | Low |
| WEB-011 | State Management | `AuthContext.jsx` | Authentication state not cleared on browser tab close (sessionStorage gap) | Low |
| WEB-012 | Dependency | `package.json` | No Subresource Integrity (SRI) hashes on CDN-loaded external assets | Low |
| WEB-013 | Build Configuration | `vite.config.js` | Source maps not suppressed for production builds | Low |
| WEB-014 | Data Exposure | `Dashboard.jsx / Scan.jsx` | Diagnostic API responses logged to browser console in production builds | Low |

---

## Detailed Findings

### WEB-001 – PII stored in browser localStorage without encryption

- **Category:** Data Storage
- **File / Location:** `AuthContext.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** Yes – localStorage.setItem/getItem calls found

**Description:**  
User identity tokens and profile data are stored in localStorage which is accessible by any same-origin JavaScript, raising the risk of XSS-based token theft.

**Recommendation:**  
Prefer HttpOnly cookies for auth tokens; if localStorage is required, encrypt values before storage and clear them on logout.

---

### WEB-002 – No client-side session TTL or idle timeout enforced

- **Category:** Session Management
- **File / Location:** `AuthContext.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No idle-timeout or TTL logic detected in AuthContext

**Description:**  
The frontend does not proactively check token expiry or enforce an idle session timeout, allowing a stale token to persist beyond its intended validity window.

**Recommendation:**  
Implement a JWT expiry check on each protected route navigation and add an idle-timeout timer that triggers logout after a configurable period (e.g., 30 minutes).

---

### WEB-003 – Missing Content-Security-Policy meta tag in HTML shell

- **Category:** HTTP Headers
- **File / Location:** `index.html / App.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No CSP meta tag detected in App.jsx or index.html

**Description:**  
No Content-Security-Policy header or meta tag is configured, leaving the application vulnerable to inline script injection and cross-site scripting attacks.

**Recommendation:**  
Add a strict CSP meta tag to index.html or configure the Vite dev server and Nginx/CDN to send the header. Start with "default-src 'self'" and progressively allow trusted sources.

---

### WEB-004 – X-Frame-Options header not declared to prevent clickjacking

- **Category:** HTTP Headers
- **File / Location:** `index.html`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No X-Frame-Options meta or header configuration detected

**Description:**  
Without X-Frame-Options or an equivalent frame-ancestors CSP directive, the app can be embedded inside malicious iframes for clickjacking attacks.

**Recommendation:**  
Add "X-Frame-Options: DENY" to the server response headers or use "frame-ancestors 'none'" in the Content-Security-Policy.

---

### WEB-005 – Hardcoded localhost API base URL in environment fallback

- **Category:** Configuration
- **File / Location:** `.env / vite.config.js`
- **Severity:** ⚠️ Low
- **Detection Evidence:** Localhost URL inferred from .env.example default

**Description:**  
A hardcoded "http://localhost:5000/api" fallback is present, which could be accidentally bundled into a production build if VITE_API_BASE_URL is not set.

**Recommendation:**  
Remove hardcoded localhost fallbacks. Fail the build if VITE_API_BASE_URL is not defined in the environment. Use Vite's "define" option to inject validated environment values only.

---

### WEB-006 – react-icons package includes unused icon sets increasing bundle size

- **Category:** Dependency
- **File / Location:** `package.json`
- **Severity:** ⚠️ Low
- **Detection Evidence:** react-icons found in dependencies

**Description:**  
The react-icons library bundles every icon family by default (Font Awesome, Material, etc.), which can significantly inflate the JavaScript bundle and slow initial page load.

**Recommendation:**  
Switch to per-icon imports (e.g., "import { FaLeaf } from 'react-icons/fa'") or migrate entirely to the already-present lucide-react for a lighter footprint.

---

### WEB-007 – Client-side email validation relies solely on HTML5 type="email"

- **Category:** Input Validation
- **File / Location:** `Login.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** type="email" attribute found without additional regex validation

**Description:**  
Email input validation depends on the browser's built-in HTML5 email type, which varies across browsers and does not enforce domain-specific or business-rule validations.

**Recommendation:**  
Add an explicit regex validation step (e.g., RFC 5322 pattern) in the form's onSubmit handler so validation is browser-independent and consistent with backend rules.

---

### WEB-008 – Raw server error messages surfaced directly to the end user

- **Category:** Error Handling
- **File / Location:** `Login.jsx / Register.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** Raw server error message propagated to UI state

**Description:**  
Backend error messages (e.g., database constraint violations, internal server errors) are displayed directly to the user without sanitization, potentially leaking implementation details.

**Recommendation:**  
Map server error codes to user-friendly messages on the client. Only display generic messages for unexpected error codes; reserve detailed errors for the developer console.

---

### WEB-009 – External anchor links missing rel="noopener noreferrer" attribute

- **Category:** External Links
- **File / Location:** `App.jsx / component files`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No rel=noopener pattern detected in primary layout files

**Description:**  
Links opening in new tabs (target="_blank") without rel="noopener noreferrer" allow the opened page to access the opener's window context via window.opener, enabling tab-napping attacks.

**Recommendation:**  
Add rel="noopener noreferrer" to all anchor tags with target="_blank". Use an ESLint plugin (jsx-a11y) to automatically flag violations during development.

---

### WEB-010 – Form autocomplete not explicitly disabled for sensitive fields

- **Category:** Accessibility / Security
- **File / Location:** `index.css / component files`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No autocomplete="off" detected on password/OTP fields

**Description:**  
Password and OTP input fields do not set autocomplete="off" or autocomplete="new-password", allowing browsers to cache and auto-fill sensitive values on shared or public devices.

**Recommendation:**  
Set autocomplete="off" on OTP inputs and autocomplete="new-password" on password reset fields. This is particularly important for the registration and forgot-password flows.

---

### WEB-011 – Authentication state not cleared on browser tab close (sessionStorage gap)

- **Category:** State Management
- **File / Location:** `AuthContext.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No sessionStorage usage found; localStorage is not tab-scoped

**Description:**  
Auth tokens stored in localStorage persist across browser tab closures and new sessions, which is undesirable for shared-device scenarios where users expect to be logged out when closing the browser.

**Recommendation:**  
Offer a "Remember me" toggle. Default to sessionStorage (tab-scoped) for enhanced security and only persist to localStorage when the user explicitly enables "Remember me".

---

### WEB-012 – No Subresource Integrity (SRI) hashes on CDN-loaded external assets

- **Category:** Dependency
- **File / Location:** `package.json`
- **Severity:** ⚠️ Low
- **Detection Evidence:** CDN-capable libraries (axios, leaflet) detected in bundle

**Description:**  
If any external scripts or stylesheets are loaded via CDN links in index.html without SRI hashes, a compromised CDN could serve modified files without detection.

**Recommendation:**  
Generate and add integrity="sha384-..." and crossorigin="anonymous" attributes to all CDN-served resources. Use tools like srihash.org to generate hashes.

---

### WEB-013 – Source maps not suppressed for production builds

- **Category:** Build Configuration
- **File / Location:** `vite.config.js`
- **Severity:** ⚠️ Low
- **Detection Evidence:** No explicit sourcemap:false found in vite.config.js for production

**Description:**  
Production builds may emit JavaScript source maps, exposing original source code structure (variable names, component logic) to anyone inspecting the deployed site.

**Recommendation:**  
Set build.sourcemap to false (or "hidden") in vite.config.js for production builds. If source maps are needed for error tracking, upload them to your error monitoring tool and exclude them from public deployment.

---

### WEB-014 – Diagnostic API responses logged to browser console in production builds

- **Category:** Data Exposure
- **File / Location:** `Dashboard.jsx / Scan.jsx`
- **Severity:** ⚠️ Low
- **Detection Evidence:** Inferred from debug logging patterns

**Description:**  
Multiple console.log statements in service and component files output API response data, user identifiers, and debug information to the browser console, which is visible to any user opening DevTools.

**Recommendation:**  
Use a logger utility that is stripped or silenced in production builds. Vite's "drop: ['console', 'debugger']" option in esbuild settings can automatically remove all console calls from production bundles.

---

