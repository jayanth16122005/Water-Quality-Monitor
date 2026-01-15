from sqlmodel import SQLModel
from app.database import engine
from app.models import User

SQLModel.metadata.create_all(engine)
