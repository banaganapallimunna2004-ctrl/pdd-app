import os
import sys
from datetime import datetime

# Add the current directory to sys.path so we can import run_tests
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from run_tests import generate_excel_report
except ImportError as e:
    print(f"Error importing generate_excel_report: {e}")
    sys.exit(1)

def verify():
    print("Starting Excel Report Verification...")

    # Mock data
    mock_results = [
        {
            "test_name": "Login Test",
            "description": "Verifies that user can log in with valid credentials.",
            "status": "Pass",
            "duration": 1.25,
            "error_msg": "",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "test_name": "NPK Monitoring Test",
            "description": "Verifies NPK data visibility in Monitoring screen.",
            "status": "Pass",
            "duration": 2.10,
            "error_msg": "",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "test_name": "Disease Scan Test",
            "description": "Verifies AI detection of Tomato Early Blight.",
            "status": "Fail",
            "duration": 5.45,
            "error_msg": "Timeout waiting for Analysis Report screen.",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    ]

    print("Generating report with mock data...")
    report_path = generate_excel_report(mock_results)

    if report_path and os.path.exists(report_path):
        size = os.path.getsize(report_path)
        print(f"SUCCESS: Report generated at {report_path}")
        print(f"Report File Size: {size} bytes")

        if size > 5000: # Basic check for non-empty Excel file
            print("VERIFICATION PASSED: Excel report logic is functional.")
            return True
        else:
            print("VERIFICATION FAILED: Generated report is too small (likely empty or corrupted).")
            return False
    else:
        print("VERIFICATION FAILED: Report file was not created.")
        return False

if __name__ == "__main__":
    if verify():
        sys.exit(0)
    else:
        sys.exit(1)
