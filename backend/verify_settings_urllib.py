import urllib.request
import json

BASE_URL = "http://localhost:8000"

def verify_settings():
    print("--- Verifying Settings API (urllib) ---")
    
    # 1. Get Default Settings
    try:
        req = urllib.request.Request(f"{BASE_URL}/settings")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("SUCCESS: GET /settings returned 200")
                data = json.loads(response.read().decode())
                print("Default Settings:", data)
            else:
                print(f"FAILURE: GET /settings returned {response.status}")
                return
    except Exception as e:
        print(f"FAILURE: Could not connect to backend: {e}")
        return

    # 2. Update Settings (Change to USD)
    payload = {
        "app_name": "New App Name",
        "company_name": "New Company",
        "currency": "USD"
    }
    
    try:
        req = urllib.request.Request(f"{BASE_URL}/settings", method="PUT")
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(payload).encode('utf-8')
        with urllib.request.urlopen(req, data=data) as response:
             if response.status == 200:
                print("SUCCESS: PUT /settings returned 200")
                updated = json.loads(response.read().decode())
                if updated['currency'] == 'USD':
                    print("SUCCESS: Currency updated to USD")
             else:
                print(f"FAILURE: PUT /settings returned {response.status}")
                return
    except Exception as e:
         print(f"FAILURE: Update request failed: {e}")
         return

if __name__ == "__main__":
    verify_settings()
