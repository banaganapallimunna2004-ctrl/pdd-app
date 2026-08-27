import os

# Appium Server Configuration
APPIUM_SERVER_URL = "http://localhost:4723"

# Root path of the Android project
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APK_PATH = os.path.join(PROJECT_ROOT, "app", "build", "outputs", "apk", "debug", "app-debug.apk")

# Appium Driver Capabilities
DESIRED_CAPS = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": "Android Emulator",
    "app": APK_PATH,
    "appPackage": "com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem",
    "appActivity": ".MainActivity",
    "noReset": False,
    "fullReset": False,
    "autoGrantPermissions": True,
    "newCommandTimeout": 300,
    "gpsEnabled": True
}
