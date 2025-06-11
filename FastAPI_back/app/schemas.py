# app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

class MapPinCreate(BaseModel):
    title: str
    inside: bool
    chair: bool
    shadow: bool
    latitude: float
    longitude: float

class MapPinResponse(MapPinCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True