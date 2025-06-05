# 🐉 Dragon Heart - 로컬 개발 환경

흡연구역 지도 애플리케이션의 로컬 개발 환경 설정 가이드입니다.

## 📁 프로젝트 구조

```
dragon-heart/
├── client/          # React 프론트엔드
├── FastAPI_back/    # FastAPI 백엔드
├── start-server.sh  # 서버 실행 스크립트
├── start-client.sh  # 클라이언트 실행 스크립트
└── README_LOCAL.md  # 이 파일
```

## 🚀 빠른 시작

### 1. 서버 실행 (터미널 1)
```bash
./start-server.sh
```

### 2. 클라이언트 실행 (터미널 2)
```bash
./start-client.sh
```

## 📋 수동 실행 방법

### FastAPI 서버 실행
```bash
cd FastAPI_back
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### React 클라이언트 실행
```bash
cd client
npm start
```

## 🌐 접속 URL

- **React 앱**: http://localhost:3000
- **FastAPI 서버**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 🔧 환경 설정

### 1. Google Maps API 키 설정
`client/.env` 파일을 생성하고 다음 내용 추가:
```
REACT_APP_GOOGLE_MAP_API_KEY=your_api_key_here
REACT_APP_API_URL=http://localhost:8000
```

### 2. FastAPI 환경 변수
`FastAPI_back/.env` 파일에 필요한 설정 추가

## ✨ 주요 기능

- 🗺️ Google Maps 연동
- 🔐 JWT 기반 인증 (로컬 쿠키 저장)
- 📝 회원가입/로그인
- 🚭 흡연구역 관리

## 🐛 문제 해결

### 서버 연결 오류
1. FastAPI 서버가 실행 중인지 확인: `curl http://localhost:8000`
2. 포트 8000이 사용 가능한지 확인
3. CORS 설정 확인

### 지도가 표시되지 않음
1. Google Maps API 키가 올바른지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. 환경 변수가 제대로 로드되었는지 확인

## 📞 도움말

- FastAPI 자동 문서: http://localhost:8000/docs
- 서버 상태 확인: http://localhost:8000/health
- React 개발자 도구 사용 권장 