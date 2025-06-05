#!/bin/bash

echo "🐉 Dragon Heart - React 클라이언트 시작"
echo "====================================="

# client 디렉토리로 이동
cd client

# 서버 상태 확인
echo "🔍 FastAPI 서버 상태 확인 중..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ FastAPI 서버가 실행 중입니다!"
else
    echo "❌ FastAPI 서버가 실행되지 않았습니다."
    echo "먼저 ./start-server.sh를 실행해주세요."
    exit 1
fi

# React 앱 실행
echo "🚀 React 앱 실행 중..."
echo "📍 URL: http://localhost:3000"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"

npm start 