# Implementation Plan: Align Web Application with Mobile App Design

This plan outlines the steps to synchronize the web application's theme, structure, and design with the "Deep Forest" Material 3 design of the mobile application.

## User Review Required

> [!IMPORTANT]
> The web application will be updated to use the mobile app's specific "Deep Forest" color palette (#2D5A27, #5D8A56, etc.). This will replace the current emerald-based green.
> We will implement a responsive bottom navigation bar for mobile screens to mimic the mobile app's user experience.

## Proposed Changes

### [Web Application Frontend]

#### [MODIFY] [tailwind.config.js](file:///C:/Project/web%20application/frontend/tailwind.config.js)
- Update the `colors` section to include the mobile app's `Agro` palette (Primary, Secondary, Tertiary, Surface, etc.).
- Add support for Dark Mode colors.

#### [MODIFY] [index.css](file:///C:/Project/web%20application/frontend/src/index.css)
- Update CSS variables in `:root` to match the new palette.
- Refine `.glass`, `.agri-panel`, and `.agri-button` classes to match the mobile app's specific glassmorphism and gradient styles.

#### [NEW] [Layout.jsx](file:///C:/Project/web%20application/frontend/src/components/Layout.jsx)
- Create a main layout wrapper that handles the responsive navigation.
- Implement a floating glassmorphism bottom bar for mobile viewports (mimicking `BottomNavigationBar` in the mobile app).
- Implement a consistent header/sidebar for desktop viewports.

#### [MODIFY] [App.jsx](file:///C:/Project/web%20application/frontend/src/App.jsx)
- Wrap all routes with the new `Layout` component.

#### [MODIFY] [Dashboard.jsx](file:///C:/Project/web%20application/frontend/src/pages/Dashboard.jsx)
- Update class names to use the new Tailwind colors (e.g., `bg-agro-primary` instead of `bg-green-600`).
- Align card and chart styles with the mobile app's dashboard feel.

## Verification Plan

### Automated Tests
- Run existing Selenium tests to ensure no regressions in functionality.
- `npm run dev` and manual visual inspection.

### Manual Verification
- Verify the mobile view (360px - 480px width) shows the bottom navigation bar.
- Verify the color palette matches the mobile app's `Color.kt`.
- Verify dark mode support if enabled in the web app.
