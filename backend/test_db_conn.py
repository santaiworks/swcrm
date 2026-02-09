import sys
import os
from sqlalchemy import create_engine, text

# Add backend to sys.path
sys.path.append(os.getcwd())

from app.core.config import settings

def test_db():
    print(f"Testing connection to: {settings.DATABASE_URL}")
    try:
        engine = create_engine(settings.DATABASE_URL, connect_args={'connect_timeout': 5})
        with engine.connect() as conn:
            result = conn.execute(text("SELECT email FROM users LIMIT 1"))
            user = result.fetchone()
            print(f"Connection successful! Found user: {user[0] if user else 'None'}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_db()
