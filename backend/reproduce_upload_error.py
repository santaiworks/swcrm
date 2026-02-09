import urllib.request
import urllib.parse
import uuid

API_URL = "http://localhost:8000"

def test_upload():
    entity_id = str(uuid.uuid4())
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
    test_upload()
