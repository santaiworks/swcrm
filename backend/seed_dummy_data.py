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

def seed_organizations(count=100):
    print(f"Seeding {count} Organizations...")
    orgs = []
    industries = [i.name for i in db.query(MasterIndustry).all()]
    employee_counts = [e.name for e in db.query(MasterEmployeeCount).all()]
    
    for _ in range(count):
        org = Organization(
            name=fake.company(),
            website=fake.url(),
            industry=random.choice(industries) if industries else None,
            no_employees=random.choice(employee_counts) if employee_counts else None,
            address=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
            country=fake.country()
        )
        db.add(org)
        orgs.append(org)
    db.commit()
    return orgs

def seed_leads(count=100):
    print(f"Seeding {count} Leads (including Deals)...")
    industries = [i.name for i in db.query(MasterIndustry).all()]
    sources = [s.name for s in db.query(MasterSource).all()]
    salutations = [s.name for s in db.query(MasterSalutation).all()]
    statuses = [s.name for s in db.query(MasterLeadStatus).all()]
    
    deal_statuses = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]

    leads = []
    for _ in range(count):
        status = random.choice(statuses) if statuses else "New"
        is_deal = status in deal_statuses
        
        lead = Lead(
            salutation=random.choice(salutations) if salutations else None,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            job_title=fake.job(),
            department=fake.bs().split()[0].capitalize(),
            email=fake.email(),
            mobile_no=fake.phone_number(),
            organization=fake.company(),
            website=fake.url(),
            industry=random.choice(industries) if industries else None,
            source=random.choice(sources) if sources else None,
            status=status,
            estimated_revenue=random.uniform(5000, 50000) if is_deal or random.random() > 0.7 else None,
            probability=random.randint(10, 90) if is_deal or random.random() > 0.7 else None,
            closing_date=fake.future_datetime(end_date="+90d") if is_deal else None
        )

        db.add(lead)
        leads.append(lead)
    db.commit()
    return leads

def seed_contacts(orgs, count=100):
    print(f"Seeding {count} Contacts...")
    contacts = []
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
        db.add(contact)
        contacts.append(contact)
    db.commit()
    return contacts

def seed_interactions(entities, count=100):
    # entities is a list of tuples (entity_type, entity_id)
    print(f"Seeding {count} Interactions (Notes, Calls, Tasks, Emails)...")
    
    for _ in range(count):
        etype, eid = random.choice(entities)
        
        # Seed Note
        db.add(Note(
            content=fake.paragraph(),
            entity_type=etype,
            entity_id=eid
        ))
        
        # Seed Task
        db.add(Task(
            title=fake.sentence(),
            description=fake.text(),
            due_date=fake.future_datetime(end_date="+30d"),
            priority=random.choice(["Low", "Medium", "High"]),
            status=random.choice(["Pending", "In Progress", "Completed"]),
            entity_type=etype,
            entity_id=eid
        ))
        
        # Seed Call
        db.add(Call(
            subject=fake.sentence(),
            notes=fake.paragraph(),
            duration=f"{random.randint(1, 15)}:{random.randint(0, 59):02d}",
            duration_seconds=random.randint(60, 900),
            status=random.choice(["Completed", "Planned", "Missed"]),
            call_type=random.choice(["Incoming", "Outgoing"]),
            entity_type=etype,
            entity_id=eid
        ))
        
        # Seed Email
        db.add(EmailLog(
            to=fake.email(),
            subject=fake.sentence(),
            body=fake.text(),
            status="Sent",
            entity_type=etype,
            entity_id=eid
        ))
        
        # Seed Activity
        db.add(Activity(
            action_type=random.choice(["CREATE", "UPDATE", "NOTE_ADDED", "TASK_CREATED"]),
            entity_type=etype,
            entity_id=str(eid),
            description=fake.sentence()
        ) )

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
        orgs = seed_organizations(100)
        contacts = seed_contacts(orgs, 100)
        leads = seed_leads(100)
        
        # Combine all entities for interactive seeding
        entities = []
        entities.extend([("ORGANIZATION", o.id) for o in orgs])
        entities.extend([("CONTACT", c.id) for c in contacts])
        entities.extend([("LEAD", lead.id) for lead in leads])
        
        seed_interactions(entities, 100)
        
        print("\nSeeding completed successfully!")
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
