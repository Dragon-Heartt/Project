# app/routes/admin.py

from fastapi import APIRouter, Depends

router = APIRouter()

import json
import os

@router.put("/approve/{index}")
def approve_pin(index: int):
    pins_file = "app/data/pins.txt"

    if not os.path.exists(pins_file):
        return {"error": "pins.txt 파일이 없습니다."}

    with open(pins_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if index < 0 or index >= len(lines):
        return {"error": "잘못된 index입니다."}

    pin_data = json.loads(lines[index])
    pin_data["approved"] = True
    lines[index] = json.dumps(pin_data, ensure_ascii=False) + "\n"

    with open(pins_file, "w", encoding="utf-8") as f:
        f.writelines(lines)

    return {"success": True, "message": "승인되었습니다."}
@router.get("/cancel-requests")
def get_cancel_requests():
    cancel_file = os.path.join("app", "data", "cancelPins.txt")
    if not os.path.exists(cancel_file):
        return []
    results = []
    with open(cancel_file, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line.strip())
            # extract filename from filesystem path
            filename = os.path.basename(item.get("photo_url", "")) or item.get("filename", "")
            # rewrite to public URL under the static mount
            item["photo_url"] = f"/cancel_uploads/{filename}"
            results.append(item)
    return results

@router.put("/cancel-approve/{index}")
def approve_cancel(index: int):
    cancel_file = "app/data/cancelPins.txt"
    pins_file = "app/data/pins.txt"

    with open(cancel_file, "r", encoding="utf-8") as f:
        cancel_lines = f.readlines()

    if index < 0 or index >= len(cancel_lines):
        return {"error": "잘못된 index입니다."}

    cancel_pin = json.loads(cancel_lines[index])
    cancel_lines.pop(index)

    with open(cancel_file, "w", encoding="utf-8") as f:
        f.writelines(cancel_lines)

    with open(pins_file, "r", encoding="utf-8") as f:
        pin_lines = f.readlines()

    updated_pins = []
    for line in pin_lines:
        try:
            pin = json.loads(line.strip())
            if (
                pin["latitude"] == cancel_pin["latitude"]
                and pin["longitude"] == cancel_pin["longitude"]
            ):
                continue
            updated_pins.append(line)
        except json.JSONDecodeError:
            continue

    with open(pins_file, "w", encoding="utf-8") as f:
        f.writelines(updated_pins)

    return {"success": True, "message": "취소 요청이 승인되어 삭제되었습니다."}

@router.put("/cancel-reject/{index}")
def reject_cancel(index: int):
    cancel_file = "app/data/cancelPins.txt"

    with open(cancel_file, "r", encoding="utf-8") as f:
        cancel_lines = f.readlines()

    if index < 0 or index >= len(cancel_lines):
        return {"error": "잘못된 index입니다."}

    cancel_lines.pop(index)

    with open(cancel_file, "w", encoding="utf-8") as f:
        f.writelines(cancel_lines)

    return {"success": True, "message": "취소 요청이 거절되어 목록에서 제거되었습니다."}