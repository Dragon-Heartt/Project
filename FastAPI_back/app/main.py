# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth  # 상대 경로로 인증 관련 라우터 가져오기
from .database import engine, Base
from fastapi.security import OAuth2PasswordBearer
from . import models  # 이 줄을 추가하세요!

# ========== DB 테이블 생성 ==========  
# 실행 시점에 models.py에 정의된 테이블을 모두 생성해 준다.
# (만약 테이블이 이미 있으면 무시 ⇒ 기존 데이터 유지)
Base.metadata.create_all(bind=engine)

# ========== FastAPI 앱 인스턴스 생성 ==========
app = FastAPI(title="Dragon-Heart FastAPI Backend")

# ========== CORS 설정 ==========
# React 프론트(예: http://localhost:3000)에서 이 서버로 API 호출할 때
# 반드시 allow_origins에 해당 출처를 명시해야 쿠키나 헤더 정보가 전달된다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # 프론트가 띄워지는 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== OAuth2PasswordBearer 선언 ==========
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ========== 라우터 등록 ==========
app.include_router(auth.router)

# (나중에 MapPin, 기타 기능 라우터가 있으면 아래처럼 추가)
# from .routes import maps
# app.include_router(maps.router)

# Optional: 루트("/")에 간단한 헬스체크 엔드포인트
@app.get("/")
def read_root():
    return {"message": "Dragon-Heart FastAPI Server is running."}