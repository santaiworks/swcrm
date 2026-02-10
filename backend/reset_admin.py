from app.core.database import SessionLocal
from app.modules.auth.models import User
from app.modules.auth.utils import get_password_hash

def reset_admin():
    db = SessionLocal()
    try:
        email = "admin@santaiworks.com"
        password = "admin123"
        
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} found. Resetting password...")
            user.hashed_password = get_password_hash(password)
            db.commit()
            print("Password reset successfully.")
        else:
            print(f"User {email} not found. Creating new admin...")
            new_user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(new_user)
            db.commit()
            print("Admin created successfully.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
