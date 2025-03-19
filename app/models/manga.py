from sqlalchemy import Column, Integer, String, Text, Float, ARRAY
from sqlalchemy.orm import relationship
from app.db.database import Base


class Manga(Base):
    __tablename__ = "manga"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    year = Column(Integer, nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    cover = Column(String, nullable=True)
    
    # Relationships
    library_entries = relationship("Library", back_populates="manga")
    reviews = relationship("Review", back_populates="manga") 