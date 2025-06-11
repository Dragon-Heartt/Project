from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MapPin

router = APIRouter()

@router.get("/pins")
def get_map_pins(db: Session = Depends(get_db)):
    pins = db.query(MapPin).all()
    return [
        {
            "id": pin.id,
            "latitude": pin.latitude,
            "longitude": pin.longitude,
            "space_type": pin.space_type,
            "has_chair": pin.has_chair,
            "has_shade": pin.has_shade,
            "description": pin.description,
        }
        for pin in pins
    ]