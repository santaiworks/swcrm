from app.core.database import SessionLocal
from sqlalchemy import text

def check_data():
    db = SessionLocal()
    try:
        # Check raw leads data
        result = db.execute(text("SELECT id, first_name, status FROM leads LIMIT 10")).fetchall()
        print("Raw Leads Data:")
        for row in result:
            print(f"ID: {row[0]}, Name: {row[1]}, Status (Raw): {row[2]} (Type: {type(row[2])})")
            
        # Check master data
        result = db.execute(text("SELECT id, name FROM master_lead_status")).fetchall()
        print("\nMaster Lead Status Data:")
        for row in result:
            print(f"ID: {row[0]}, Name: {row[1]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
