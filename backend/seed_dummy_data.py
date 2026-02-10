import os
import sys
import random
from datetime import datetime
from faker import Faker
from sqlalchemy.orm import Session

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal, engine
from app.core import database
from app.modules.auth.models import User
from app.modules.auth.utils import get_password_hash
from app.modules.employees.models import Employee
from app.modules.organizations.models import Organization
from app.modules.contacts.models import Contact
from app.modules.leads.models import Lead
from app.modules.tasks.models import Task
from app.modules.notes.models import Note
from app.modules.calls.models import Call
from app.modules.emails.models import EmailLog
from app.modules.activities.models import Activity
from app.modules.master_data.models import (
    MasterIndustry, MasterSource, MasterSalutation, 
    MasterEmployeeCount, MasterLeadStatus
)

fake = Faker()
db: Session = SessionLocal()

def seed_master_data():
    print("Seeding Master Data...")
    
    # Industries
    industries = ["Technology", "Finance", "Healthcare", "Manufacturing", "Retail", "Education", "Real Estate", "Other"]
    for name in industries:
        if not db.query(MasterIndustry).filter(MasterIndustry.name == name).first():
            db.add(MasterIndustry(name=name))
            
    # Sources
    sources = ["Website", "Referral", "Cold Call", "Exhibition", "LinkedIn", "Other"]
    for name in sources:
        if not db.query(MasterSource).filter(MasterSource.name == name).first():
            db.add(MasterSource(name=name))
            
    # Salutations
    salutations = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."]
    for name in salutations:
        if not db.query(MasterSalutation).filter(MasterSalutation.name == name).first():
            db.add(MasterSalutation(name=name))
            
    # Employee Counts
    counts = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
    for name in counts:
        if not db.query(MasterEmployeeCount).filter(MasterEmployeeCount.name == name).first():
            db.add(MasterEmployeeCount(name=name))
            
    # Lead Statuses (Merged Leads & Deals)
    statuses = [
        ("New", "#3b82f6"),
        ("Attempted to Contact", "#f59e0b"),
        ("Contacted", "#10b981"),
        ("Qualified", "#8b5cf6"),
        ("Unqualified", "#6b7280"),
        # Deal Stages
        ("Proposal", "#6366f1"), 
        ("Negotiation", "#8b5cf6"),
        ("Closed Won", "#10b981"),
        ("Closed Lost", "#ef4444")
    ]
    for name, color in statuses:
        if not db.query(MasterLeadStatus).filter(MasterLeadStatus.name == name).first():
            db.add(MasterLeadStatus(name=name, color=color))
            
    db.commit()

def seed_organizations(count=500):
    print(f"Seeding {count} Organizations...")
    orgs = []
    industries = db.query(MasterIndustry).all()
    employee_counts = db.query(MasterEmployeeCount).all()
    
    start_date = datetime(2025, 11, 1)
    
    for _ in range(count):
        org = Organization(
            name=fake.company(),
            website=fake.url(),
            industry=random.choice(industries).id if industries else None,
            no_employees=random.choice(employee_counts).id if employee_counts else None,
            address=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
            country=fake.country()
        )
        org.created_at = fake.date_time_between(start_date=start_date, end_date='now')
        db.add(org)
        orgs.append(org)
    db.commit()
    return orgs

def seed_leads(count=500):
    print(f"Seeding {count} Leads (including Deals)...")
    industries = db.query(MasterIndustry).all()
    sources = db.query(MasterSource).all()
    salutations = db.query(MasterSalutation).all()
    statuses = db.query(MasterLeadStatus).all()
    employee_counts = db.query(MasterEmployeeCount).all()
    
    deal_status_names = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
    start_date = datetime(2025, 11, 1)

    leads = []
    for _ in range(count):
        status_obj = random.choice(statuses) if statuses else None
        is_deal = status_obj.name in deal_status_names if status_obj else False
        
        cdate = fake.date_time_between(start_date=start_date, end_date='now')
        
        lead = Lead(
            salutation=random.choice(salutations).id if salutations else None,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            job_title=fake.job(),
            department=fake.bs().split()[0].capitalize(),
            email=fake.email(),
            mobile_no=fake.phone_number(),
            organization=fake.company(),
            website=fake.url(),
            industry=random.choice(industries).id if industries else None,
            no_employees=random.choice(employee_counts).id if employee_counts else None,
            source=random.choice(sources).id if sources else None,
            status=status_obj.id if status_obj else None,
            estimated_revenue=random.uniform(5000, 50000) if is_deal or random.random() > 0.7 else None,
            probability=random.randint(10, 90) if is_deal or random.random() > 0.7 else None,
            closing_date=fake.future_datetime(end_date="+90d") if is_deal else None
        )
        lead.created_at = cdate
        db.add(lead)
        leads.append(lead)
    db.commit()
    return leads

def seed_contacts(orgs, count=500):
    print(f"Seeding {count} Contacts...")
    contacts = []
    start_date = datetime(2025, 11, 1)

    for _ in range(count):
        org = random.choice(orgs)
        contact = Contact(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            mobile_no=fake.phone_number(),
            job_title=fake.job(),
            organization=org.name,
            organization_id=org.id
        )
        contact.created_at = fake.date_time_between(start_date=start_date, end_date='now')
        db.add(contact)
        contacts.append(contact)
    db.commit()
    return contacts

def seed_interactions(entities, count=500):
    # entities is a list of tuples (entity_type, entity_id)
    print(f"Seeding {count} Interactions with Lifecycle Flow...")
    
    from app.modules.master_data.models import MasterTaskStatus, MasterTaskPriority, MasterLeadStatus
    task_statuses = db.query(MasterTaskStatus).all()
    task_priorities = db.query(MasterTaskPriority).all()
    lead_statuses = db.query(MasterLeadStatus).all()
    ls_map = {s.name: s.id for s in lead_statuses}
    
    start_date = datetime(2025, 11, 1)

    # To simulate flow, we pick some leads and give them multiple interactions
    for etype, eid in entities:
        if etype != "LEAD":
            # Simple random interaction for others
            cdate = fake.date_time_between(start_date=start_date, end_date='now')
            db.add(Note(content=fake.paragraph(), entity_type=etype, entity_id=eid, created_at=cdate))
            continue
            
        # For LEADS, simulate a flow
        lead = db.query(Lead).filter(Lead.id == eid).first()
        if not lead: continue

        # Initial Call -> Contacted
        if random.random() > 0.3:
            cdate = fake.date_time_between(start_date=lead.created_at, end_date='now')
            db.add(Call(subject="Initial Discovery Call", notes=fake.paragraph(), duration="5:30", status="Completed", call_type="Outgoing", entity_type=etype, entity_id=eid, created_at=cdate))
            # Potentially update status to Contacted if it was New
            contacted_id = ls_map.get("Contacted")
            if contacted_id and lead.status == ls_map.get("New"):
                lead.status = contacted_id
                lead.updated_at = cdate
            
        # Follow up Task -> Qualified
        if random.random() > 0.5:
            # Task cdate should be after created_at
            cdate = fake.date_time_between(start_date=lead.created_at, end_date='now')
            db.add(Task(title="Follow up with prospect", description=fake.text(), priority_id=random.choice(task_priorities).id, status_id=random.choice(task_statuses).id, entity_type=etype, entity_id=eid, created_at=cdate))
            qualified_id = ls_map.get("Qualified")
            if qualified_id and random.random() > 0.5:
                lead.status = qualified_id
                lead.updated_at = cdate
        
        # If it's a Won deal, make sure closing_date and updated_at are set
        won_id = ls_map.get("Closed Won")
        if lead.status == won_id:
             # Ensure updated_at is some time after created_at
             lead.updated_at = fake.date_time_between(start_date=lead.created_at, end_date='now')
             if not lead.closing_date:
                 lead.closing_date = lead.updated_at

        # Email logs
        for _ in range(random.randint(1, 3)):
            cdate = fake.date_time_between(start_date=lead.created_at, end_date='now')
            db.add(EmailLog(to=fake.email(), subject=fake.sentence(), body=fake.text(), status="Sent", entity_type=etype, entity_id=eid, sent_at=cdate))

    db.commit()

def seed_users(count=10):
    print(f"Seeding {count} Users and Employees...")
    
    # Ensure admin user
    admin = db.query(User).filter(User.email == "admin@santaiworks.com").first()
    if not admin:
        admin = User(
            email="admin@santaiworks.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrator",
            is_superuser=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Create employee record for admin
        admin_emp = Employee(
            user_id=admin.id,
            nik="ADM-001",
            phone="08123456789",
            department="IT",
            position="System Admin",
            join_date=datetime.now().date()
        )
        db.add(admin_emp)
    
    departments = ["Sales", "Marketing", "Fulfillment", "HR", "Finance", "IT"]
    positions = ["Manager", "Staff", "Lead", "Coordinator"]
    
    for i in range(count):
        email = fake.unique.email()
        user = User(
            email=email,
            hashed_password=get_password_hash("password123"),
            full_name=fake.name(),
            is_superuser=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        emp = Employee(
            user_id=user.id,
            nik=f"SLW-{100 + i}",
            phone=fake.phone_number(),
            department=random.choice(departments),
            position=random.choice(positions),
            join_date=fake.past_date()
        )
        db.add(emp)
    
    db.commit()

def main():
    try:
        # Create tables if not exist
        database.Base.metadata.create_all(bind=engine)
        
        seed_master_data()
        seed_users(10)
        orgs = seed_organizations(500)
        contacts = seed_contacts(orgs, 500)
        leads = seed_leads(500)
        
        # Combine all entities for interactive seeding
        entities = []
        entities.extend([("ORGANIZATION", o.id) for o in orgs])
        entities.extend([("CONTACT", c.id) for c in contacts])
        entities.extend([("LEAD", lead.id) for lead in leads])
        
        seed_interactions(entities, 500)
        
        print("\nSeeding completed successfully!")
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
