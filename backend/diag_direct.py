import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.modules.master_data.services import MasterDataService
from app.modules.master_data.schemas import MasterDataResponse

TABLES = [
    'master_industries',
    'master_sources',
    'master_salutations',
    'master_employee_counts',
    'master_lead_status',
    'master_task_status',
    'master_task_priority'
]

def test_direct():
    db = SessionLocal()
    try:
        for table in TABLES:
            print(f"Testing {table}...")
            data = MasterDataService.get_all(db, table)
            if data is None:
                print(f"  FAILED: table not found")
                continue
            
            print(f"  Count: {len(data)}")
            if len(data) > 0:
                try:
                    # Test serialization
                    resp = [MasterDataResponse.model_validate(d) for d in data]
                    print(f"  Example: {resp[0].model_dump()}")
                except Exception as e:
                    print(f"  Serialization Error for {table}: {e}")
                    import traceback
                    traceback.print_exc()
    except Exception as e:
        print(f"  General Failure: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_direct()
