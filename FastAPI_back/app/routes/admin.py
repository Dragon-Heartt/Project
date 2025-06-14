# app/routes/admin.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MapPin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/pins")
def get_all_pins(db: Session = Depends(get_db)):
    return db.query(MapPin).all()

@router.put("/approve/{pin_id}")
def approve_pin(pin_id: int, db: Session = Depends(get_db)):
    pin = db.query(MapPin).filter(MapPin.id == pin_id).first()
    if not pin:
        return {"error": "존재하지 않는 핀입니다."}
    pin.is_approved = True
    db.commit()
    return {"success": True, "message": "승인되었습니다."}