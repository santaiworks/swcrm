import sys
import os
from sqlalchemy import create_engine, text

# Add backend to sys.path
sys.path.append(os.getcwd())

from app.core.config import settings

def check_users():
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT email, hashed_password, is_active, is_deleted FROM users"))
            users = result.fetchall()
            print(f"Total users found: {len(users)}")
            for user in users:
                print(f"Email: {user[0]}, Active: {user[2]}, Deleted: {user[3]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users()
