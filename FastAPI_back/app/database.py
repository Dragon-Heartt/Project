# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# 1) .env 파일에서 환경 변수 로드
# 이 프로젝트의 루트가 FastAPI_back/ 이므로, 자동으로 .env를 찾아 읽는다
load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_USER = os.getenv("MYSQL_USER", "dhuser")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "dhpasswd")
MYSQL_DB = os.getenv("MYSQL_DB", "SmokeMapDB")

# 2) SQLAlchemy 연결 문자열 생성
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

# 3) Engine 객체 생성
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,   # 커넥션 유효성 검사 옵션
)

# 4) 세션 팩토리(SessionLocal) 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 5) Base 클래스 선언
Base = declarative_base()

# 6) Dependency: 라우터 함수 안에서 `db: Session = Depends(get_db)`로 사용
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()