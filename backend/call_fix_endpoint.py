import urllib.request

API_URL = "http://localhost:8000"

def fix_schema():
    req = urllib.request.Request(f"{API_URL}/attachments/fix/schema", method='DELETE')
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Response: {response.read().decode('utf-8')}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    fix_schema()
