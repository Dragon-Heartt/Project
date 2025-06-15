from fastapi import APIRouter, Depends
import json
from fastapi.responses import JSONResponse
import os

router = APIRouter()

@router.get("/pins")
def get_map_pins():
    pins_file = "app/data/pins.txt"
    if not os.path.exists(pins_file):
        return []

    with open(pins_file, "r", encoding="utf-8") as f:
        pins = []
        for line in f:
            try:
                data = json.loads(line.strip())
                if not data.get("approved"):
                    continue
                filename = os.path.basename(data["photo_url"])
                pin_info = {
                    "title": data.get("title"),
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "space_type": data.get("space_type"),
                    "has_chair": data.get("has_chair"),
                    "has_shade": data.get("has_shade"),
                    "photo_url": f"/uploads/{filename}"
                }
                pins.append(pin_info)
            except json.JSONDecodeError:
                continue
    return JSONResponse(content=pins)

@router.get("/pins/pending")
def get_pending_pins():
    pins_file = "app/data/pins.txt"
    if not os.path.exists(pins_file):
        return []

    pending = []
    with open(pins_file, "r", encoding="utf-8") as f:
        for file_index, line in enumerate(f):
            try:
                data = json.loads(line.strip())
                if str(data.get("approved")).lower() == "false":
                    data["fileIndex"] = file_index
                    if data.get("photo_url"):
                        filename = os.path.basename(data["photo_url"])
                        data["photo_url"] = f"/uploads/{filename}"
                    pending.append(data)
            except json.JSONDecodeError:
                continue
    return JSONResponse(content=pending)