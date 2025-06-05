#!/bin/bash

echo "🐉 Dragon Heart - FastAPI 서버 시작"
echo "=================================="

# FastAPI_back 디렉토리로 이동
cd FastAPI_back

# 가상환경 활성화 (있는 경우)
if [ -d "venv" ]; then
    echo "📦 가상환경 활성화 중..."
    source venv/bin/activate
fi

# 서버 실행
echo "🚀 FastAPI 서버 실행 중..."
echo "📍 URL: http://localhost:8000"
echo "📚 API 문서: http://localhost:8000/docs"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 