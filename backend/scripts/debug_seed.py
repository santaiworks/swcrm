import sys
import os

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from app.core import database  # noqa: E402
from app.modules.calls.models import Call  # noqa: E402
from app.modules.organizations.models import Organization  # noqa: E402
from app.modules.contacts.models import Contact  # noqa: E402

def debug_seed():
    db = database.SessionLocal()
    try:
        print("Checking Calls count...")
        count = db.query(Call).count()
        print(f"Current Calls count: {count}")
        
        if count == 0:
            print("Seeding a test call...")
            # Ensure an Org and Contact exist
            org = db.query(Organization).first()
            if not org:
                print("No Organization found. Creating one...")
                org = Organization(name="Debug Org", website="debug.com", industry="Debug")
                db.add(org)
                db.commit()
                db.refresh(org)
            
            contact = db.query(Contact).first()
            if not contact:
                print("No Contact found. Creating one...")
                contact = Contact(first_name="Debug", last_name="User", email="debug@debug.com", organization_id=org.id)
                db.add(contact)
                db.commit()
                db.refresh(contact)

            call = Call(
                subject="Debug Call",
                duration="5:00",
                status="Completed",
                entity_type="CONTACT",
                entity_id=contact.id
            )
            db.add(call)
            db.commit()
            print("Seeded test call.")
            
            # Verify again
            count_new = db.query(Call).count()
            print(f"New Calls count: {count_new}")
        else:
            print("Calls already exist.")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_seed()
