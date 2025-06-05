import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

# 직접 import
import sys
sys.path.append('..')
try:
    from .. import schemas
except ImportError:
    try:
        import schemas
    except ImportError:
        # schemas 모듈이 없으면 직접 정의
        from pydantic import BaseModel
        
        class UserCreate(BaseModel):
            email: str
            password: str
            
        class UserLogin(BaseModel):
            email: str
            password: str
            
        class schemas:
            UserCreate = UserCreate
            UserLogin = UserLogin

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 로컬 개발용 기본 SECRET_KEY
SECRET_KEY = os.getenv("SECRET_KEY", "local-development-secret-key-dragon-heart-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 로컬 테스트용 임시 사용자 저장소
temp_users = {}

@router.post("/signup", status_code=201)
def signup(request: schemas.UserCreate):
    print(f"📝 회원가입 요청: {request.email}")
    
    # 임시 메모리 저장소 사용 (로컬 테스트용)
    if request.email in temp_users:
        print(f"❌ 이미 존재하는 이메일: {request.email}")
        raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다.")

    hashed_pw = hash_password(request.password)
    temp_users[request.email] = {
        "email": request.email,
        "password": hashed_pw,
        "created_at": datetime.utcnow()
    }
    
    print(f"✅ 회원가입 성공: {request.email}")
    print(f"📊 현재 사용자 수: {len(temp_users)}")
    return {"message": "회원가입 성공"}

@router.post("/login")
def login(request: schemas.UserLogin):
    print(f"🔐 로그인 요청: {request.email}")
    
    # 임시 메모리 저장소에서 사용자 찾기
    user = temp_users.get(request.email)
    if not user or not verify_password(request.password, user["password"]):
        print(f"❌ 로그인 실패: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    print(f"✅ 로그인 성공: {request.email}")
    return {"access_token": access_token, "token_type": "bearer"}

# 데이터베이스 기반 엔드포인트 (주석 처리)
"""
@router.post("/signup", status_code=201)
def signup(request: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다.")

    hashed_pw = hash_password(request.password)
    new_user = models.User(email=request.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "회원가입 성공"}

@router.post("/login")
def login(request: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
"""

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증 정보가 유효하지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # 임시 메모리 저장소에서 사용자 찾기
    user = temp_users.get(email)
    if user is None:
        raise credentials_exception
    return user

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "created_at": current_user["created_at"]
    }

# 테스트용 엔드포인트
@router.get("/test")
def test_auth():
    return {
        "message": "🐉 인증 서비스 테스트 성공!",
        "users_count": len(temp_users),
        "secret_key_exists": bool(SECRET_KEY)
    }