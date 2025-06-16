from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

from .routes import auth  
from .routes import smokingZone 
from .routes import map
from .routes import pinCancel
from .routes import admin
from fastapi.security import OAuth2PasswordBearer

app = FastAPI(title="Dragon-Heart FastAPI Backend")

from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="app/data/uploads"), name="uploads")
app.mount("/cancel_uploads", StaticFiles(directory="app/data/cancel_uploads"), name="cancel_uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app.include_router(auth.router, prefix="/auth")
app.include_router(smokingZone.router, prefix="/smokingZone")
app.include_router(map.router, prefix="/map")
app.include_router(pinCancel.router, prefix="/pinCancel")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def read_root():
    return {"message": "Dragon-Heart FastAPI Server is running."}
