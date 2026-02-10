import requests

TABLES = [
    'master_industries',
    'master_sources',
    'master_salutations',
    'master_employee_counts',
    'master_lead_status',
    'master_task_status',
    'master_task_priority'
]

API_URL = "http://127.0.0.1:8000"

def test_endpoints():
    for table in TABLES:
        try:
            url = f"{API_URL}/master-data/{table}"
            print(f"Testing {url}...")
            r = requests.get(url)
            print(f"  Status: {r.status_code}")
            if r.status_code != 200:
                print(f"  Error: {r.text}")
            else:
                data = r.json()
                print(f"  Count: {len(data)}")
                if len(data) > 0:
                    print(f"  Example: {data[0]}")
        except Exception as e:
            print(f"  Failed: {e}")

if __name__ == "__main__":
    test_endpoints()
