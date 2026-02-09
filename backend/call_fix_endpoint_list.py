import urllib.request

API_URL = "http://localhost:8000"

def fix_schema():
    req = urllib.request.Request(f"{API_URL}/attachments/fix/schema", method='GET')
    import json
    try:
        with urllib.request.urlopen(req) as response:
            data = json.load(response)
            if 'constraints' in data:
                print(f"Search Path: {data.get('search_path')}")
                for c in data['constraints']:
                    print(c)
            else:
                print(data)
    except urllib.error.HTTPError as e:
        print(f"Request failed: {e.code} {e.reason}")
        print(f"Error content: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    fix_schema()
