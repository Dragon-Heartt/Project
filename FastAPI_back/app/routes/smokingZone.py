from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
import os
from datetime import datetime
import json

router = APIRouter()

@router.post("/smokingM")
async def apply_location(
    title: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    space_type: bool = Form(False),
    has_chair: bool = Form(False),
    has_shade: bool = Form(False),
    description: str = Form(""),
    photo: UploadFile = File(None)
):
    os.makedirs("app/data", exist_ok=True)
    UPLOAD_DIR = "app/data/uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    photo_url = None
    if photo:
        filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{photo.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(await photo.read())
        photo_url = filepath

    pin_data = {
        "title": title,
        "latitude": latitude,
        "longitude": longitude,
        "space_type": space_type,
        "has_chair": has_chair,
        "has_shade": has_shade,
        "description": description,
        "photo_url": photo_url,
        "created_at": datetime.utcnow().isoformat()
    }

    with open("app/data/pins.txt", "a", encoding="utf-8") as f:
        f.write(json.dumps(pin_data, ensure_ascii=False) + "\n")

    return {"message": "공간 신청 완료"}