from app.core.database import SessionLocal
from app.modules.master_data.models import (
    MasterTaskStatus, MasterTaskPriority, MasterLeadStatus,
    MasterIndustry, MasterSource, MasterSalutation, MasterEmployeeCount
)

def seed_master_data():
    db = SessionLocal()
    try:
        print("Seeding all master data...")
        
        # Task Statuses
        task_statuses = [
            {"name": "Backlog", "icon": "CircleDashed", "color": "#71717a"},
            {"name": "Todo", "icon": "Circle", "color": "#71717a"},
            {"name": "In Progress", "icon": "CircleDot", "color": "#f59e0b"},
            {"name": "Done", "icon": "CheckCircle2", "color": "#10b981"},
            {"name": "Canceled", "icon": "XCircle", "color": "#ef4444"},
        ]
        for s in task_statuses:
            exists = db.query(MasterTaskStatus).filter(MasterTaskStatus.name == s["name"]).first()
            if not exists: db.add(MasterTaskStatus(**s))
            else:
                for k, v in s.items(): setattr(exists, k, v)

        # Task Priorities
        task_priorities = [
            {"name": "Low", "color": "#e2e8f0"},
            {"name": "Medium", "color": "#fbbf24"},
            {"name": "High", "color": "#ef4444"},
        ]
        for p in task_priorities:
            exists = db.query(MasterTaskPriority).filter(MasterTaskPriority.name == p["name"]).first()
            if not exists: db.add(MasterTaskPriority(**p))
            else:
                for k, v in p.items(): setattr(exists, k, v)

        # Lead Statuses
        lead_statuses = [
            {"name": "New", "color": "#3b82f6"},
            {"name": "Attempted to Contact", "color": "#f59e0b"},
            {"name": "Contacted", "color": "#10b981"},
            {"name": "Qualified", "color": "#8b5cf6"},
            {"name": "Unqualified", "color": "#6b7280"},
            {"name": "Proposal", "color": "#6366f1"}, 
            {"name": "Negotiation", "color": "#8b5cf6"},
            {"name": "Closed Won", "color": "#10b981"},
            {"name": "Closed Lost", "color": "#ef4444"}
        ]
        for s in lead_statuses:
            exists = db.query(MasterLeadStatus).filter(MasterLeadStatus.name == s["name"]).first()
            if not exists: db.add(MasterLeadStatus(**s))
            else:
                for k, v in s.items(): setattr(exists, k, v)

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

        db.commit()
        print("All master data seeded successfully.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_master_data()
