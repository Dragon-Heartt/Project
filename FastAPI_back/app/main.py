from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth  # 필요 시 다른 라우트도 import

app = FastAPI()

# CORS 설정 (쿠키 사용 시 꼭 필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router)
# 다른 라우터도 있으면 여기에 추가
# app.include_router(smokingZone.router) 등등