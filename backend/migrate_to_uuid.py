from sqlalchemy import text
from app.core.database import engine, Base
# Import all models to ensure they are registered with Base
from app.modules.master_data.models import *
from app.modules.tasks.models import *
from app.modules.leads.models import *

def migrate():
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        print("Dropping legacy tables...")
        # Drop dependent tables first
        conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS leads CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_task_status CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_task_priority CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_industries CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_sources CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_salutations CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_employee_counts CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS master_lead_status CASCADE;"))
        
    print("Recreating tables with UUIDs...")
    Base.metadata.create_all(bind=engine)
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
