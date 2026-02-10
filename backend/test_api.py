import requests

def test_tasks_api():
    try:
        response = requests.get("http://127.0.0.1:8000/tasks")
        print("Status Code:", response.status_code)
        if response.status_code == 200:
            print("Data (first 2):", response.json()[:2])
        else:
            print("Error:", response.text)
    except Exception as e:
        print("Fetch Error:", e)

if __name__ == "__main__":
    test_tasks_api()
