from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, func
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MapPin(Base):
    __tablename__ = "map_pins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # 이 줄 추가!
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    inside = Column(Boolean, default=False)
    chair = Column(Boolean, default=False)
    shadow = Column(Boolean, default=False)
    title = Column(String(100), index=True, nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())