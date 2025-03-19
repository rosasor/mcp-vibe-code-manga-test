from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    manga_id = Column(Integer, ForeignKey("manga.id"))
    content = Column(Text)
    rating = Column(Integer)  # 1-5 rating
    likes = Column(Integer, default=0)
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    manga = relationship("Manga", back_populates="reviews")
    like_entries = relationship("Like", back_populates="review")


class Like(Base):
    __tablename__ = "likes"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), primary_key=True)
    
    # Relationships
    user = relationship("User", back_populates="likes")
    review = relationship("Review", back_populates="like_entries") 