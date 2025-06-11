# app/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

load_dotenv()

# .env 에 DATABASE_URL="mysql+pymysql://dhuser:dhpasswd@localhost:3306/SmokeMapDB" 같이 정의되어 있어야 합니다.
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://dhuser:dhpasswd@localhost:3306/SmokeMapDB"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    """FastAPI Depends 에 넣어 쓰는 DB 세션 생성기"""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()