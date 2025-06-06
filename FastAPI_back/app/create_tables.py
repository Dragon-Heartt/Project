from .database import engine, Base
from . import models

Base.metadata.create_all(bind=engine)
print("테이블 생성 완료")