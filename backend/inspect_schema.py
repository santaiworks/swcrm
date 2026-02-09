import sys
import os
from sqlalchemy import create_engine, inspect

# Add backend to sys.path
sys.path.append(os.getcwd())

from app.core.config import settings

def inspect_db():
    try:
        engine = create_engine(settings.DATABASE_URL)
        inspector = inspect(engine)
        columns = inspector.get_columns('users')
        print("Columns in 'users' table:")
        for column in columns:
            print(f"- {column['name']} ({column['type']})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_db()
