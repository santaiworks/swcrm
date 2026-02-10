import urllib.request
import json

def test_api():
    url = "http://localhost:8000/leads"
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"Total leads: {len(data)}")
                if len(data) > 0:
                    print("First lead details:")
                    print(json.dumps(data[0], indent=2))
            else:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_api()
