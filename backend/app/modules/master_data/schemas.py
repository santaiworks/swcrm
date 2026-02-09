from pydantic import BaseModel

class MasterDataCreate(BaseModel):
    name: str

class MasterDataResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True
