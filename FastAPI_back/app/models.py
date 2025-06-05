from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class MapPin(Base):
    __tablename__ = "map_pins"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    inside = Column(Boolean, default=False)
    chair = Column(Boolean, default=False)
    shadow = Column(Boolean, default=False)
    latitude = Column(Float)
    longitude = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
