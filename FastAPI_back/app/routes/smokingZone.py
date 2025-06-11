from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db        # <- 상대경로!
from ..models import MapPin
import os
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/smokingM")
async def apply_location(
    title: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
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
        user_id=1,
        title=title,
        space_type=bool(space_type),
        has_chair=bool(has_chair),
        has_shade=bool(has_shade),
        latitude=latitude,
        longitude=longitude,
        description=photo_url
    )

    db.add(new_pin)
    db.commit()
    db.refresh(new_pin)

    return {"message": "공간 신청 완료", "id": new_pin.id}