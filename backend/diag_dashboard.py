import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")

def check_dashboard_data():
    print(f"Connecting to {API_URL}...")
    
    # 1. Fetch leads
    try:
        with urllib.request.urlopen(f"{API_URL}/leads") as response:
            if response.status == 200:
                leads = json.loads(response.read().decode())
                print(f"Total leads from API: {len(leads)}")
                if len(leads) > 0:
                    print("First Lead Sample:")
                    print(json.dumps(leads[0], indent=2))
                    
                    statuses_in_data = set()
                    labels_in_data = set()
                    for l in leads:
                        statuses_in_data.add(str(l.get("status")))
                        labels_in_data.add(str(l.get("status_label")))
                    print(f"Unique status IDs in data: {statuses_in_data}")
                    print(f"Unique status labels in data: {labels_in_data}")
            else:
                print(f"Failed to fetch leads: {response.status}")
    except Exception as e:
        print(f"Error fetching leads: {e}")

    # 2. Fetch master statuses
    try:
        with urllib.request.urlopen(f"{API_URL}/master-data/master_lead_status?query=") as response:
            if response.status == 200:
                statuses = json.loads(response.read().decode())
                print(f"\nMaster Statuses ({len(statuses)}):")
                for s in statuses:
                    print(f"- ID: {s['id']}, Name: {s['name']}")
            else:
                print(f"Failed to fetch statuses: {response.status}")
    except Exception as e:
        print(f"Error fetching statuses: {e}")

if __name__ == "__main__":
    check_dashboard_data()
