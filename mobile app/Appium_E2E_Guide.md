# AgroAI Appium End-to-End Test Suite Guide

This document provides instructions on how to set up and run the automated end-to-end (E2E) testing suite for the AgroAI application.

## Prerequisites

1.  **Python 3.8+**: Ensure Python is installed and added to your PATH.
2.  **Appium Server**: Install Appium via npm:
    ```bash
    npm install -g appium
    ```
3.  **Appium UiAutomator2 Driver**:
    ```bash
    appium driver install uiautomator2
    ```
4.  **Android SDK**: Ensure `ANDROID_HOME` is set and `adb` is functional.
5.  **Android Emulator/Device**: A running emulator or physical device with USB debugging enabled.

## Setup

1.  Navigate to the `appium_tests` directory:
    ```bash
    cd appium_tests
    ```
2.  Install required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Tests

To execute the full E2E test suite and generate a professional Excel analysis report, run the following command:

```bash
python run_tests.py
```

### What the test suite covers:
*   **Splash & Auth**: Verifies splash timing and redirection to the Login screen.
*   **User Registration**: Tests the Signup flow with strict Gmail validation.
*   **Tab Navigation**: Cycles through Home, Scan, Monitor, Alerts, and Profile tabs.
*   **AI Chatbot**: Verifies interactive messaging with the Agro Assistant.
*   **Precision Scan**: Simulates a crop disease scan and verifies the analysis report.
*   **Advanced Tools**: Executes Cloud Sync, Report Export, and IoT Calibration simulations.
*   **Logout**: Ensures secure session termination.

## Test Analysis Report

After execution, the system generates `test_analysis_report.xlsx` in the `appium_tests` folder. This report includes:
- **Test Run Summary**: KPI dashboard (Pass Rate, Duration, Metrics).
- **Detailed Test Logs**: Step-by-step diagnostics, execution timestamps, and failure error messages.

## Troubleshooting
- **Connection Error**: Ensure the Appium server is running on `http://localhost:4723`.
- **Package Not Found**: Build the debug APK first using `./gradlew assembleDebug` to ensure the app is ready for deployment.
