# Implementation Plan - Professional Bottom Navigation Bar

Refactor the current custom bottom navigation bar to use Material 3 `NavigationBar` for a more professional, consistent, and user-friendly experience.

## User Review Required

> [!IMPORTANT]
> The navigation bar will transition from a floating glass-morphism style to a standard Material 3 pinned bottom navigation bar. This improves accessibility and follows Android design standards.

## Proposed Changes

### UI Components

#### [MODIFY] [MainScreen.kt](file:///C:/Project/mobile app/app/src/main/java/com/example/ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem/ui/screens/MainScreen.kt)
- Update `BottomNavItem` to include both selected and unselected icons for a more dynamic feel.
- Replace the custom `BottomNavigationBar` implementation with Material 3 `NavigationBar`.
- Improve navigation logic to correctly handle `crop_selection` as part of the "Scan" tab.
- Refine colors to use the professional "Agro" palette from the theme.

```kotlin
// Example of updated BottomNavItem
sealed class BottomNavItem(
    val titleRes: Int,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val route: String
) {
    object Home : BottomNavItem(R.string.nav_home, Icons.Filled.Home, Icons.Outlined.Home, "home")
    object Scan : BottomNavItem(R.string.nav_scan, Icons.Filled.CenterFocusWeak, Icons.Outlined.CenterFocusWeak, "scan")
    object Monitor : BottomNavItem(R.string.nav_monitor, Icons.Filled.Analytics, Icons.Outlined.Analytics, "monitor")
    object Alerts : BottomNavItem(R.string.nav_alerts, Icons.Filled.Notifications, Icons.Outlined.Notifications, "alerts")
    object Profile : BottomNavItem(R.string.nav_profile, Icons.Filled.AccountCircle, Icons.Outlined.AccountCircle, "profile")
}
```

## Verification Plan

### Automated Tests
- Build the project to ensure no compilation errors after refactoring.
- Check for any lint warnings related to navigation.

### Manual Verification
- Deploy the app to a physical device or emulator.
- Verify that each navigation item correctly highlights when selected.
- Verify that navigating to "Crop Selection" correctly highlights the "Scan" tab.
- Ensure the `FloatingActionButton` (Chatbot) does not overlap with the new navigation bar awkwardly.
- Confirm the overall aesthetic matches the "Professional" requirement.
