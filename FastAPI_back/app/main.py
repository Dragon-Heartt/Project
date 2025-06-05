from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth  # 상대 import로 변경

app = FastAPI(
    title="Dragon Heart API (Local)",
    version="1.0.0",
    description="로컬 개발 환경용 API"
)

# 로컬 개발 환경용 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서버 상태 확인 엔드포인트
@app.get("/")
async def root():
    return {
        "message": "🐉 Dragon Heart API (Local) is running!",
        "status": "healthy",
        "environment": "local"
    }

# Health check 엔드포인트
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api": "running",
        "environment": "local"
    }

# 라우터 등록
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)