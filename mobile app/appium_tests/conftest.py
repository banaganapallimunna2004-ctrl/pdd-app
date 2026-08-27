import pytest
import time
import os
import json
from appium import webdriver
from appium.options.common import AppiumOptions
from config import DESIRED_CAPS, APPIUM_SERVER_URL

# Global list to hold test run results
_results = []

@pytest.fixture(scope="session")
def driver():
    # Set up Appium Options
    options = AppiumOptions()
    for key, value in DESIRED_CAPS.items():
        options.set_capability(key, value)
    
    print(f"Connecting to Appium server at {APPIUM_SERVER_URL}...")
    try:
        driver = webdriver.Remote(APPIUM_SERVER_URL, options=options)
    except Exception as e:
        print(f"FAILED to connect to Appium Server at {APPIUM_SERVER_URL}.")
        print("Please ensure the Appium server is running ('appium' command).")
        raise e

    driver.implicitly_wait(10)
    
    yield driver
    
    print("Quitting Appium driver...")
    driver.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # Execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()
    
    # Log results for call phase
    if rep.when == "call":
        test_name = item.name
        # Format name to be readable
        test_readable_name = test_name.replace("test_", "").replace("_", " ").title()
        
        doc = item.obj.__doc__ or ""
        duration = round(rep.duration, 2)
        status = "Pass" if rep.passed else "Fail"
        
        # Clean up the error message if any
        error_msg = ""
        if rep.failed:
            if hasattr(rep.longrepr, 'reprcrash'):
                error_msg = rep.longrepr.reprcrash.message
            else:
                error_msg = str(rep.longrepr)
        
        _results.append({
            "test_name": test_readable_name,
            "description": doc.strip(),
            "status": status,
            "duration": duration,
            "error_msg": error_msg,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })

def pytest_sessionfinish(session, exitstatus):
    # Write results to a temp json file at session end
    results_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".test_results.json")
    with open(results_path, "w") as f:
        json.dump(_results, f, indent=4)
    print(f"Saved temporary test results to: {results_path}")
