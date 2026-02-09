import requests

BASE_URL = "http://localhost:8000"

def verify_settings():
    print("--- Verifying Settings API ---")
    
    # 1. Get Default Settings
    try:
        res = requests.get(f"{BASE_URL}/settings")
        if res.status_code == 200:
            print("SUCCESS: GET /settings returned 200")
            print("Default Settings:", res.json())
        else:
            print(f"FAILURE: GET /settings returned {res.status_code}")
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
        res = requests.put(f"{BASE_URL}/settings", json=payload)
        if res.status_code == 200:
            print("SUCCESS: PUT /settings returned 200")
            updated = res.json()
            if updated['currency'] == 'USD':
                print("SUCCESS: Currency updated to USD")
            else:
                print("FAILURE: Currency not updated")
        else:
            print(f"FAILURE: PUT /settings returned {res.status_code}")
            print(res.text)
            return
    except Exception as e:
         print(f"FAILURE: Update request failed: {e}")
         return

    # 3. Verify Persistence
    try:
        res = requests.get(f"{BASE_URL}/settings")
        current = res.json()
        if current['currency'] == 'USD' and current['app_name'] == 'New App Name':
            print("SUCCESS: Settings persisted correctly.")
        else:
             print("FAILURE: Persisted settings allow incorrect values.")
             print(current)
    except Exception as e:
        print(f"FAILURE: Verification request failed: {e}")

if __name__ == "__main__":
    verify_settings()
