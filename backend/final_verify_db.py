from sqlalchemy import inspect
from app.core.database import engine

def verify():
    inspector = inspect(engine)
    tables = [
        "tasks", "leads", "master_task_status", "master_task_priority",
        "master_industries", "master_sources", "master_salutations", 
        "master_employee_counts", "master_lead_status"
    ]
    
    print("--- Database Schema Verification ---")
    for table in tables:
        columns = inspector.get_columns(table)
        id_col = next((c for c in columns if c['name'] == 'id'), None)
        print(f"Table: {table}")
        if id_col:
            print(f"  ID Type: {id_col['type']}")
        
        if table == "tasks":
            s_id = next((c for c in columns if c['name'] == 'status_id'), None)
            p_id = next((c for c in columns if c['name'] == 'priority_id'), None)
            print(f"  status_id Type: {s_id['type'] if s_id else 'MISSING'}")
            print(f"  priority_id Type: {p_id['type'] if p_id else 'MISSING'}")
        
        if table == "leads":
            s = next((c for c in columns if c['name'] == 'status'), None)
            i = next((c for c in columns if c['name'] == 'industry'), None)
            print(f"  status Type: {s['type'] if s else 'MISSING'}")
            print(f"  industry Type: {i['type'] if i else 'MISSING'}")

if __name__ == "__main__":
    verify()
