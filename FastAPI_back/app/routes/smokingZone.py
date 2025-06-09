# app/routes/smokingZone.py

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MapPin
import os
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/api/apply")
async def apply_location(
    address: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    space_type: str = Form(...),
    has_chair: int = Form(...),
    has_shade: int = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # 사진 저장 처리
    photo_url = None
    if photo:
        filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{photo.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(await photo.read())
        photo_url = filepath

    # DB 저장
    new_pin = MapPin(
        title=address,  # title을 address로 저장 (혹시 따로 받으면 바꿔)
        inside=(space_type == 'indoor'),
        chair=bool(has_chair),
        shadow=bool(has_shade),
        latitude=lat,
        longitude=lng,
        description=photo_url  # description 필드를 이미지 경로로 사용
    )

    db.add(new_pin)
    db.commit()
    db.refresh(new_pin)

    return {"message": "공간 신청 완료", "id": new_pin.id}