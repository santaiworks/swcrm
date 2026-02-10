from app.core.database import SessionLocal
from app.modules.master_data.models import MasterTaskStatus, MasterTaskPriority

def seed_data():
    db = SessionLocal()
    try:
        # Task Statuses
        statuses = [
            {"name": "Backlog", "icon": "CircleDashed", "color": "#71717a"},
            {"name": "Todo", "icon": "Circle", "color": "#71717a"},
            {"name": "In Progress", "icon": "CircleDot", "color": "#f59e0b"},
            {"name": "Done", "icon": "CheckCircle2", "color": "#10b981"},
            {"name": "Canceled", "icon": "XCircle", "color": "#ef4444"},
        ]
        
        for s in statuses:
            exists = db.query(MasterTaskStatus).filter(MasterTaskStatus.name == s["name"]).first()
            if not exists:
                db.add(MasterTaskStatus(**s))
            else:
                # Update existing for color/icon consistency
                for key, value in s.items():
                    setattr(exists, key, value)
        
        # Task Priorities
        priorities = [
            {"name": "Low", "color": "#e2e8f0"},
            {"name": "Medium", "color": "#fbbf24"},
            {"name": "High", "color": "#ef4444"},
        ]
        
        for p in priorities:
            exists = db.query(MasterTaskPriority).filter(MasterTaskPriority.name == p["name"]).first()
            if not exists:
                db.add(MasterTaskPriority(**p))
            else:
                for key, value in p.items():
                    setattr(exists, key, value)
        
        db.commit()
        print("Task master data seeded successfully.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
