import os
import sys

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.modules.auth.models import User
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
    MasterTaskStatus, MasterTaskPriority, MasterLeadStatus,
    MasterIndustry, MasterSource, MasterSalutation, MasterEmployeeCount
)
from sqlalchemy import text

print("Dropping deals table if exists...")
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS deals CASCADE"))
    conn.commit()

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Finished dropping tables.")

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Finished creating tables.")
