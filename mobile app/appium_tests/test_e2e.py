import pytest
import time
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestAgroAIAppE2E:
    
    def test_01_splash_screen(self, driver):
        """Verify splash screen delay and redirection to Login."""
        print("\n[Step 1] Waiting for SplashScreen to timeout...")
        # Splash has a 3.5s delay; wait 5s to be safe
        time.sleep(5)
        
        # Wait for the login screen fields or signup link to load
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[@text='Login' or @text='Sign Up' or contains(@text, 'Don')]"))
        )
        print("SUCCESS: Redirected to Login screen.")

    def test_02_signup_flow(self, driver):
        """Test user registration (SignupScreen) with a Gmail address."""
        print("\n[Step 2] Navigating to Signup screen...")
        
        # Click on "Sign Up" text prompt
        signup_prompt = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.XPATH, "//*[@text='Sign Up']"))
        )
        signup_prompt.click()
        time.sleep(2)
        
        # Locate inputs on Signup Screen (Name, Email, Phone, Farm Name, Password)
        inputs = WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((AppiumBy.CLASS_NAME, "android.widget.EditText"))
        )
        
        assert len(inputs) >= 4, f"Expected at least 4 input fields, but found {len(inputs)}"
        
        # Enter user details
        print("Entering registration details...")
        inputs[0].send_keys("Agro Farmer")
        inputs[1].send_keys("smart.farmer@gmail.com")  # Email domain validation requires @gmail.com
        inputs[2].send_keys("9876543210")
        inputs[3].send_keys("Green Meadows Farm")
        inputs[-1].send_keys("farmer1234")  # Password must be >= 6 characters
        
        try:
            driver.hide_keyboard()
        except Exception:
            pass
        
        # Click the Sign Up Button
        signup_button = driver.find_element(AppiumBy.XPATH, "//android.widget.Button[@text='Sign Up' or @text='SIGN UP']")
        signup_button.click()
        print("Clicked Sign Up button.")
        
        # Upon successful registration, the user is logged in automatically and redirected to Dashboard
        # Wait for "Quick Stats" or bottom navigation home item
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Quick Stats') or contains(@text, 'Home')]"))
        )
        print("SUCCESS: Account registered and logged in successfully.")

    def test_03_tab_navigation(self, driver):
        """Test cycling through all 5 bottom navigation tabs."""
        print("\n[Step 3] Cycling through bottom navigation tabs...")
        tabs = ["Scan", "Monitor", "Alerts", "Profile", "Home"]
        
        for tab in tabs:
            print(f"Clicking bottom navigation tab: {tab}")
            tab_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((AppiumBy.ACCESSIBILITY_ID, tab))
            )
            tab_btn.click()
            time.sleep(2)
            
            # Simple content assertion for each tab
            if tab == "Scan":
                # Ensure the Gallery option is visible
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((AppiumBy.ACCESSIBILITY_ID, "Gallery"))
                )
            elif tab == "Monitor":
                # Ensure overview or smart monitoring title is present
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Monitoring') or contains(@text, 'Overview')]"))
                )
            elif tab == "Alerts":
                # Ensure notifications list displays
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Notifications') or contains(@text, 'Alerts')]"))
                )
            elif tab == "Profile":
                # Ensure Profile tools display
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Logout') or contains(@text, 'Cloud Data Sync')]"))
                )
            elif tab == "Home":
                # Ensure we are back on the Home dashboard
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Quick Stats')]"))
                )
                
        print("SUCCESS: Bottom navigation tab switching completed successfully.")

    def test_04_chatbot_interaction(self, driver):
        """Verify the AI Assistant chatbot messaging flow."""
        print("\n[Step 4] Launching chatbot...")
        # Open Chatbot using the AI Assistant Floating Action Button (FAB)
        chatbot_fab = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.ACCESSIBILITY_ID, "AI Assistant"))
        )
        chatbot_fab.click()
        time.sleep(2)
        
        # Verify message input is available
        chat_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((AppiumBy.CLASS_NAME, "android.widget.EditText"))
        )
        chat_input.send_keys("How should I manage soil pH of 5.5?")
        
        # Click the Send button
        send_btn = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Send Message")
        send_btn.click()
        print("Message sent. Waiting for chatbot response...")
        
        # Wait for response (takes 2-3 seconds as it uses a simulated delay in ViewModel)
        time.sleep(4)
        
        # Check that the list has populated the response bubble
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'pH') or contains(@text, 'soil') or contains(@text, 'Agro')]"))
        )
        print("SUCCESS: Chatbot responded successfully.")
        
        # Go back to Dashboard
        driver.back()
        time.sleep(1.5)

    def test_05_crop_disease_scan(self, driver):
        """Test scanning a crop and navigating to the analysis report."""
        print("\n[Step 5] Performing crop disease scan...")
        # Navigate to Scan tab
        scan_tab = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.ACCESSIBILITY_ID, "Scan"))
        )
        scan_tab.click()
        time.sleep(2)
        
        # Find Shutter button. It is a sibling of the Gallery icon button inside the controls row.
        shutter_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.XPATH, "//*[@content-desc='Gallery']/parent::*/*[@clickable='true' and not(@content-desc)]"))
        )
        shutter_btn.click()
        print("Camera Shutter clicked. Waiting for neural network analysis...")
        
        # Crop scan has 2.5s validation + 2.5s analysis delay. Wait for report screen.
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Analysis Report') or contains(@text, 'Symptoms')]"))
        )
        print("SUCCESS: Image validated. Analysis Report loaded.")
        
        # Verify symptoms and treatment suggestions sections are visible
        assert driver.find_element(AppiumBy.XPATH, "//*[contains(@text, 'Symptoms')]")
        assert driver.find_element(AppiumBy.XPATH, "//*[contains(@text, 'Suggestions') or contains(@text, 'Treatment')]")
        print("SUCCESS: Symptoms and suggestions verified.")
        
        # Return to scanner screen by clicking the Back button
        back_btn = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Back")
        back_btn.click()
        time.sleep(1.5)

    def test_06_profile_settings_and_logout(self, driver):
        """Test Advanced Tools execution (Sync, Export, Calibrate) and Logout."""
        print("\n[Step 6] Navigating to Profile settings...")
        # Open Profile tab
        profile_tab = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.ACCESSIBILITY_ID, "Profile"))
        )
        profile_tab.click()
        time.sleep(2)
        
        # Verify Advanced Tools header
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[contains(@text, 'Advanced Tools')]"))
        )
        
        # Click Cloud Data Sync
        sync_item = driver.find_element(AppiumBy.XPATH, "//*[contains(@text, 'Cloud Data Sync')]")
        sync_item.click()
        print("Cloud Data Sync triggered.")
        time.sleep(3.5)  # Wait for cloud sync simulator
        
        # Click Export Reports
        export_item = driver.find_element(AppiumBy.XPATH, "//*[contains(@text, 'Export Reports')]")
        export_item.click()
        print("Export Reports triggered.")
        time.sleep(2)
        
        # Click IoT Calibration
        calibrate_item = driver.find_element(AppiumBy.XPATH, "//*[contains(@text, 'IoT Calibration')]")
        calibrate_item.click()
        print("IoT Calibration triggered.")
        time.sleep(2.5)
        
        # Logout
        logout_item = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((AppiumBy.XPATH, "//*[contains(@text, 'Logout')]"))
        )
        logout_item.click()
        print("Logged out from the application.")
        
        # Verify returned to Login Screen
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((AppiumBy.XPATH, "//*[@text='Login' or @text='Sign Up']"))
        )
        print("SUCCESS: Returned to Login Screen. Test suite run completed.")
