# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

from .routes import auth  # 상대 경로로 인증 관련 라우터 가져오기
from .routes import smokingZone 
from .routes import map
from .routes import pinCancel
from fastapi.security import OAuth2PasswordBearer

# ========== FastAPI 앱 인스턴스 생성 ==========
app = FastAPI(title="Dragon-Heart FastAPI Backend")

# ========== CORS 설정 ==========
# React 프론트(예: http://localhost:3000)에서 이 서버로 API 호출할 때
# 반드시 allow_origins에 해당 출처를 명시해야 쿠키나 헤더 정보가 전달된다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== OAuth2PasswordBearer 선언 ==========
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ========== 라우터 등록 ==========
app.include_router(auth.router, prefix="/auth")
app.include_router(smokingZone.router, prefix="/smokingZone")
app.include_router(map.router, prefix="/map")
app.include_router(pinCancel.router, prefix="/pinCancel")
# (나중에 MapPin, 기타 기능 라우터가 있으면 아래처럼 추가)
# from .routes import maps
# app.include_router(maps.router)

# Optional: 루트("/")에 간단한 헬스체크 엔드포인트
@app.get("/")
def read_root():
    return {"message": "Dragon-Heart FastAPI Server is running."}
