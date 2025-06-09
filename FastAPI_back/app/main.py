# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth  # 상대 경로로 인증 관련 라우터 가져오기
from .database import engine, Base
from fastapi.security import OAuth2PasswordBearer

app = FastAPI(title="Dragon-Heart FastAPI Backend")

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

from .routes import smokingZone  # 이 줄 추가
app.include_router(smokingZone.router)  # 이 줄도 추가