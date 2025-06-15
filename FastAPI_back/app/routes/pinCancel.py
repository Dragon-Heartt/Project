from fastapi import APIRouter, HTTPException, Form, File, UploadFile
import json
import os
from datetime import datetime

router = APIRouter()

@router.post("/pins/cancel")
async def cancel_pin(
    latitude: float = Form(...),
    longitude: float = Form(...),
    title: str = Form(...),
    photo: UploadFile = File(...)
):
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    pins_file = os.path.join(base_dir, "data", "pins.txt")
    cancel_file = os.path.join(base_dir, "data", "cancelPins.txt")
    upload_dir = os.path.join(base_dir, "data", "uploads")

    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(os.path.dirname(cancel_file), exist_ok=True)

    if not os.path.exists(pins_file):
        raise HTTPException(status_code=404, detail="pins.txt not found")

    with open(pins_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        try:
            pin = json.loads(line.strip())
            if (
                pin["latitude"] == latitude
                and pin["longitude"] == longitude
            ):
                
                cancel_upload_dir = os.path.join(base_dir, "data", "cancel_uploads")
                os.makedirs(cancel_upload_dir, exist_ok=True)
                
                filename = f"cancel_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{photo.filename}"
                filepath = os.path.join(cancel_upload_dir, filename)
                with open(filepath, "wb") as img_f:
                    img_f.write(await photo.read())

                cancel_data = {
                    "title": title,
                    "latitude": latitude,
                    "longitude": longitude,
                    "photo_url": filepath,
                    "created_at": datetime.utcnow().isoformat()
                }

                try:
                    with open(cancel_file, "a", encoding="utf-8") as cancel_f:
                        cancel_f.write(json.dumps(cancel_data, ensure_ascii=False) + "\n")
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"파일 쓰기 실패: {str(e)}")

                return {"message": "취소 요청이 저장되었습니다."}
        except json.JSONDecodeError:
            continue

    raise HTTPException(status_code=404, detail="일치하는 핀을 찾을 수 없습니다.")