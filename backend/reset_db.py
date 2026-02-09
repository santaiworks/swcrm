import os
import sys

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import engine, Base
# Import all models to ensure they are registered with Base.metadata
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
