import os
from fastapi import APIRouter, Depends, HTTPException, status, Query
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app import models
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

USER_FILE = os.path.join(os.path.dirname(__file__), "../data/user.txt")

def save_user_to_txt(email: str, hashed_password: str):
    with open(USER_FILE, "a") as f:
        created_at = datetime.utcnow().isoformat()
        f.write(f"{email},{hashed_password},{created_at}\n")

def check_email_exists(email: str):
    try:
        with open(USER_FILE, "r") as f:
            for line in f:
                saved_email = line.strip().split(",")[0]
                if saved_email == email:
                    return True
    except FileNotFoundError:
        return False
    return False

def authenticate_user(email: str, password: str):
    try:
        with open(USER_FILE, "r") as f:
            for line in f:
                saved_email, saved_hashed_pw, _ = line.strip().split(",")
                if saved_email == email and verify_password(password, saved_hashed_pw):
                    return True
    except FileNotFoundError:
        return False
    return False

router = APIRouter()

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

@router.get("/check-email")
def check_email(email: str = Query(...)):
    return {"available": True}


@router.post("/signup", status_code=201)
def signup(request: schemas.UserCreate):
    if check_email_exists(request.email):
        raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다.")
    hashed_pw = hash_password(request.password)
    save_user_to_txt(request.email, hashed_pw)
    return {"message": "회원가입 성공 (txt 저장 방식)"}

@router.post("/login")
def login(request: schemas.UserLogin):
    if not authenticate_user(request.email, request.password):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")
    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer"}


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

@router.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"email": "example@example.com", "created_at": "2025-01-01T00:00:00"}
