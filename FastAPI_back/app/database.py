# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# 1) .env 파일에서 환경 변수 로드
load_dotenv()  # 프로젝트 루트(여기서는 FastAPI_back/)에 있는 .env 파일을 읽습니다.

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_USER = os.getenv("MYSQL_USER", "dhuser")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "dhpasswd")
MYSQL_DB = os.getenv("MYSQL_DB", "SmokeMapDB")

# 2) SQLAlchemy 연결 문자열 생성
#    mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

# 3) create_engine으로 Engine 객체 생성
#    pool_recycle 옵션 등 필요에 따라 추가 설정 가능
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,        # 커넥션 유효성 체크
)

# 4) 세션팩토리(SessionLocal) 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 5) 베이스 클래스(Base) 정의
Base = declarative_base()

# 6) Dependency 함수: 라우터 함수 내부에서 `db: Session = Depends(get_db)`로 사용
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()