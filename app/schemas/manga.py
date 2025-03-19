from pydantic import BaseModel
from typing import Optional, List


class MangaBase(BaseModel):
    title: str
    description: Optional[str] = None
    year: Optional[int] = None
    tags: Optional[List[str]] = None
    cover: Optional[str] = None


class MangaCreate(MangaBase):
    pass


class MangaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    tags: Optional[List[str]] = None
    cover: Optional[str] = None


class MangaInDB(MangaBase):
    id: int
    rating: float = 0.0

    class Config:
        from_attributes = True


class Manga(MangaInDB):
    """Manga model returned to clients"""
    pass


class MangaSearchResults(BaseModel):
    results: List[Manga]
    total: int 