import sys
import os

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from sqlalchemy.orm import Session  # noqa: E402
from app.core import database  # noqa: E402
from app.modules.master_data import models as master_models  # noqa: E402
from app.modules.auth import models as auth_models, utils  # noqa: E402
from app.modules.organizations.models import Organization  # noqa: E402
from app.modules.contacts.models import Contact  # noqa: E402
from app.modules.deals.models import Deal  # noqa: E402
from app.modules.calls.models import Call  # noqa: E402

def seed_superadmin(db: Session):
    try:
        email = "admin@santaiworks.com"
        password = "1234567890"
        
        user = db.query(auth_models.User).filter(auth_models.User.email == email).first()
        if not user:
            print(f"Creating superadmin {email}...")
            db_user = auth_models.User(
                email=email,
                hashed_password=utils.get_password_hash(password),
                full_name="Super Admin",
                is_active=True,
                is_superuser=True
            )
            db.add(db_user)
            db.commit()
            print("Superadmin created.")
        else:
            print("Superadmin already exists.")
    except Exception as e:
        print(f"Error seeding user: {e}")

def seed_master_data(db: Session):
    try:
        print("Seeding Master Data...")
        
        # Industries
        industries = ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"]
        for name in industries:
            if not db.query(master_models.MasterIndustry).filter_by(name=name).first():
                db.add(master_models.MasterIndustry(name=name))
        
        # Sources
        sources = ["Website", "Referral", "Cold Call"]
        for name in sources:
            if not db.query(master_models.MasterSource).filter_by(name=name).first():
                db.add(master_models.MasterSource(name=name))

        # Statuses
        statuses = [
            {"name": "New", "color": "blue"},
            {"name": "Contacted", "color": "yellow"},
            {"name": "Qualified", "color": "green"},
            {"name": "Deal", "color": "emerald"},
            {"name": "Lost", "color": "red"}
        ]
        for status in statuses:
            if not db.query(master_models.MasterLeadStatus).filter_by(name=status["name"]).first():
                db.add(master_models.MasterLeadStatus(name=status["name"], color=status["color"]))

        db.commit()
        print("Master Data seeded.")
    except Exception as e:
        print(f"Error seeding master data: {e}")

def seed_entities(db: Session):
    try:
        print("Seeding Entities (Organizations, Contacts, Deals, Calls)...")
        
        # Organizations
        orgs_data = [
            {"name": "Acme Corp", "website": "acme.com", "industry": "Technology"},
            {"name": "Globex Inc", "website": "globex.com", "industry": "Manufacturing"},
            {"name": "Soylent Corp", "website": "soylent.com", "industry": "Healthcare"}
        ]
        
        created_orgs = []
        for data in orgs_data:
            org = db.query(Organization).filter_by(name=data["name"]).first()
            if not org:
                org = Organization(**data)
                db.add(org)
                db.commit()
                db.refresh(org)
            created_orgs.append(org)
            
        # Contacts
        contacts_data = [
            {"first_name": "John", "last_name": "Doe", "email": "john@acme.com", "organization_id": created_orgs[0].id},
            {"first_name": "Jane", "last_name": "Smith", "email": "jane@globex.com", "organization_id": created_orgs[1].id},
            {"first_name": "Bob", "last_name": "Jones", "email": "bob@soylent.com", "organization_id": created_orgs[2].id}
        ]
        
        created_contacts = []
        for data in contacts_data:
            contact = db.query(Contact).filter_by(email=data["email"]).first()
            if not contact:
                contact = Contact(**data)
                db.add(contact)
                db.commit()
                db.refresh(contact)
            created_contacts.append(contact)
            
        # Deals
        deals_data = [
            {"name": "Acme Big Deal", "amount": 50000000, "stage": "Negotiation", "contact_id": created_contacts[0].id, "organization_id": created_orgs[0].id},
            {"name": "Globex Contract", "amount": 12000000, "stage": "Proposal", "contact_id": created_contacts[1].id, "organization_id": created_orgs[1].id},
        ]
        
        for data in deals_data:
            deal = db.query(Deal).filter_by(name=data["name"]).first()
            if not deal:
                deal = Deal(**data)
                db.add(deal)
        db.commit()

        # Calls
        calls_data = [
            {"subject": "Initial Sync", "duration": "15:00", "status": "Completed", "entity_type": "CONTACT", "entity_id": created_contacts[0].id},
            {"subject": "Proposal Review", "duration": "30:00", "status": "Planned", "entity_type": "DEAL", "entity_id": created_orgs[0].id}, # Linking to Org ID as proxy for Deal if needed, but Deal ID is better. Let's find the deal.
        ]
        
        # Link 2nd call to the first deal
        deal1 = db.query(Deal).filter_by(name="Acme Big Deal").first()
        if deal1:
            calls_data[1]["entity_id"] = deal1.id
            calls_data[1]["entity_type"] = "DEAL"

        for data in calls_data:
            # Simple check to avoid duplicates based on subject and entity_id
            call = db.query(Call).filter_by(subject=data["subject"], entity_id=data["entity_id"]).first()
            if not call:
                call = Call(**data)
                db.add(call)
        db.commit()
        
        print("Entities seeded successfully!")

    except Exception as e:
        print(f"Error seeding entities: {e}")
        import traceback
        traceback.print_exc()

def main():
    # Create tables if not exist (including new ones)
    print("Ensuring tables exist...")
    database.Base.metadata.create_all(bind=database.engine)
    
    db = database.SessionLocal()
    try:
        seed_superadmin(db)
        seed_master_data(db)
        seed_entities(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
