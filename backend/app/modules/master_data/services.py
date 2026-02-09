from sqlalchemy.orm import Session
from .models import MasterIndustry, MasterSource, MasterSalutation, MasterEmployeeCount, MasterLeadStatus
from .schemas import MasterDataCreate

class MasterDataService:
    @staticmethod
    def get_model_by_table_name(table_name: str):
        if table_name == 'master_industries':
            return MasterIndustry
        if table_name == 'master_sources':
            return MasterSource
        if table_name == 'master_salutations':
            return MasterSalutation
        if table_name == 'master_employee_counts':
            return MasterEmployeeCount
        if table_name == 'master_lead_status':
            return MasterLeadStatus
        return None

    @staticmethod
    def get_all(db: Session, table_name: str, query: str = None):
        model = MasterDataService.get_model_by_table_name(table_name)
        if not model:
            return None
        
        q = db.query(model)
        if query:
            q = q.filter(model.name.ilike(f"%{query}%"))
        return q.all()

    @staticmethod
    def create(db: Session, table_name: str, item: MasterDataCreate):
        model = MasterDataService.get_model_by_table_name(table_name)
        if not model:
            return None
        
        db_item = model(name=item.name)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
