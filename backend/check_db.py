from sqlalchemy import text
from app.core import config
from app.core.database import engine

def check_columns():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM tasks LIMIT 1"))
        print("Columns in tasks table:", result.keys())

if __name__ == "__main__":
    check_columns()
