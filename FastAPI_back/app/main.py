from fastapi import FastAPI
from app.routes import auth  # auth.py에서 router 불러오기

app = FastAPI()

# 라우터 등록
app.include_router(auth.router)