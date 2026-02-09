import urllib.request
import urllib.parse
import json

API_URL = "http://localhost:8000"

def create_lead():
    print("Creating a new lead...")
    data = {
        "first_name": "Test",
        "last_name": "Lead",
        "email": "test@example.com",
        "status": "New"
    }
    
    req = urllib.request.Request(f"{API_URL}/leads", data=json.dumps(data).encode('utf-8'))
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.getcode() == 201:
                res_json = json.loads(response.read().decode('utf-8'))
                print(f"Lead created with ID: {res_json['id']}")
                return res_json['id']
            else:
                print(f"Failed to create lead: {response.getcode()}")
                return None
    except Exception as e:
        print(f"Error creating lead: {e}")
        return None

def upload_attachment(entity_id):
    entity_type = "LEAD"
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    # Construct the body
    body = []
    
    # entity_type
    body.append(f"--{boundary}")
    body.append('Content-Disposition: form-data; name="entity_type"')
    body.append('')
    body.append(entity_type)
    
    # entity_id
    body.append(f"--{boundary}")
    body.append('Content-Disposition: form-data; name="entity_id"')
    body.append('')
    body.append(entity_id)
    
    # is_public
    body.append(f"--{boundary}")
    body.append('Content-Disposition: form-data; name="is_public"')
    body.append('')
    body.append('false')
    
    # description
    body.append(f"--{boundary}")
    body.append('Content-Disposition: form-data; name="description"')
    body.append('')
    body.append('Contoh deskripsi file')
    
    # file
    body.append(f"--{boundary}")
    body.append('Content-Disposition: form-data; name="file"; filename="test.txt"')
    body.append('Content-Type: text/plain')
    body.append('')
    body.append('This is a test file content')
    
    body.append(f"--{boundary}--")
    body.append('')
    
    body_str = "\r\n".join(body).encode('utf-8')
    
    req = urllib.request.Request(f"{API_URL}/attachments/upload", data=body_str)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    
    print(f"Uploading file for {entity_type} {entity_id}...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"Request failed: {e.code} {e.reason}")
        print(f"Error content: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    lead_id = create_lead()
    if lead_id:
        upload_attachment(lead_id)
