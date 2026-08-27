# Firebase Setup & OTP Configuration Guide

To make the Phone OTP authentication work, you must configure your Firebase project correctly. Follow these steps:

## 1. Enable Phone Authentication
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **agroai-professional-upgrade**.
3. In the left menu, click **Authentication**.
4. Click the **Sign-in method** tab.
5. Find **Phone** and click **Enable**.
6. (Optional) Add test phone numbers for development.

## 2. Add SHA Fingerprints (Critical)
Firebase needs your app's SHA fingerprints to verify that the OTP request is coming from your app.

### How to get your SHA keys:
1. Open the **Terminal** in Android Studio.
2. Run the following command:
   ```bash
   ./gradlew signingReport
   ```
3. Look for the `debug` variant in the output. You will see lines like:
   - `SHA1: XX:XX:XX:XX...`
   - `SHA256: XX:XX:XX:XX...`

### Add them to Firebase:
1. In the Firebase Console, click the **Gear icon (Settings)** > **Project settings**.
2. Scroll down to **Your apps** and select the Android app.
3. Click **Add fingerprint**.
4. Paste your **SHA-1** and save.
5. Click **Add fingerprint** again, paste your **SHA-256**, and save.

## 3. Update google-services.json
1. In Firebase Project settings, click the **google-services.json** download button.
2. Replace the existing file at:
   `app/google-services.json`
3. Rebuild your project in Android Studio.

## 4. Troubleshooting
- **"Verification Failed: This app is not authorized"**: This means your SHA-1 fingerprint is missing or incorrect in the Firebase Console.
- **"SafetyNet" or "reCAPTCHA"**: Firebase may use these for verification. If you see a browser opening, it's normal unless configured otherwise in the console.

> [!TIP]
> Always use the full phone number including the country code (e.g., +919876543210).
