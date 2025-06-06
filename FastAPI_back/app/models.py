# app/models.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # (선택) 사용자가 추가한 map pin을 참조할 경우
    # map_pins = relationship("MapPin", back_populates="user")


class MapPin(Base):
    __tablename__ = "map_pins"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True, nullable=False)
    inside = Column(Boolean, default=False)   # 실내 여부
    chair = Column(Boolean, default=False)    # 의자 유무
    shadow = Column(Boolean, default=False)   # 차양막 유무
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # (선택) ORM 관계 설정
    # user = relationship("User", back_populates="map_pins")