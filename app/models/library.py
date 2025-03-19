from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base


class StatusEnum(str, enum.Enum):
    READING = "reading"
    COMPLETED = "completed"
    ON_HOLD = "on-hold"
    DROPPED = "dropped"
    PLAN_TO_READ = "plan-to-read"


class Library(Base):
    __tablename__ = "library"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    manga_id = Column(Integer, ForeignKey("manga.id"), primary_key=True)
    status = Column(Enum(StatusEnum), default=StatusEnum.PLAN_TO_READ)
    progress = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="library_entries")
    manga = relationship("Manga", back_populates="library_entries") 