import sys
import os
import uuid
import traceback

# Adjust path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from app.core.config import settings  # noqa: E402
from app.modules.leads.models import Lead  # noqa: E402
from app.modules.deals.models import Deal  # noqa: E402
from app.modules.contacts.models import Contact  # noqa: E402
from app.modules.organizations.models import Organization  # noqa: E402
from app.modules.leads.services import LeadService  # noqa: E402

def test_conversion():
    # Setup DB
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Starting conversion test...")
    
    try:
        # 1. Create Lead directly
        lead_id = uuid.uuid4()
        lead = Lead(
            id=lead_id,
            first_name="TestConversion",
            last_name="User",
            email=f"test_{lead_id}@example.com",
            status="New",
            organization="Test Org Inc."
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        print(f"Created Lead: {lead.id}")

        # 2. Update Status to Deal using Service
        updated_lead = LeadService.update_lead_status(db, lead.id, "Deal")
        
        if updated_lead:
            print(f"Updated Lead Status: {updated_lead.status}")
        else:
            print("Failed to update lead status")
            return

        # 3. Verify Deal
        deal = db.query(Deal).filter(Deal.lead_id == lead.id).first()
        if deal:
            print(f"Deal created: {deal.id}, Org ID: {deal.organization_id}")
        else:
            print("Deal NOT created")

        # 4. Verify Contact
        contact = db.query(Contact).filter(Contact.lead_id == lead.id).first()
        if contact:
            print(f"Contact created: {contact.id}, Org ID: {contact.organization_id}")
        else:
            print("Contact NOT created")

        # 5. Verify Organization
        if deal and deal.organization_id:
            org = db.query(Organization).filter(Organization.id == deal.organization_id).first()
            if org:
                print(f"Organization created: {org.name}")
            else:
                print("Organization NOT found (but ID exists in Deal)")
        elif contact and contact.organization_id:
             print(f"Contact has Org ID: {contact.organization_id}")
        else:
             print("Organization Linkage MISSING in Deal/Contact")

        # 6. Verify Filtering
        leads = LeadService.get_leads(db)
        found = any(itm.id == lead.id for itm in leads)
        if found:
            print("Lead STILL visible in get_leads list (Expected: HIDDEN)")
        else:
            print("Lead HIDDEN from get_leads list (Expected)")
            
    except Exception as e:
        print(f"Test Exception: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_conversion()
