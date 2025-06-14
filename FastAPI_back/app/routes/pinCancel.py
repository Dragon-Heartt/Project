from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

@router.delete("/pins/cancel")
def cancel_pin(latitude: float, longitude: float, user_id: int):
    filepath = "app/data/pins.txt"

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="pins.txt not found")

    deleted = False
    new_lines = []

    with open(filepath, "r", encoding="utf-8") as file:
        for line in file:
            try:
                pin = json.loads(line.strip())
                if (
                    pin["latitude"] == latitude
                    and pin["longitude"] == longitude
                    and pin["user_id"] == user_id
                ):
                    deleted = True
                else:
                    new_lines.append(line)
            except json.JSONDecodeError:
                continue

    with open(filepath, "w", encoding="utf-8") as file:
        file.writelines(new_lines)

    if not deleted:
        raise HTTPException(status_code=404, detail="Matching pin not found")

    return {"message": "Pin deleted successfully"}