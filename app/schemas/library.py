from pydantic import BaseModel
from typing import Optional, List
from app.models.library import StatusEnum
from app.schemas.manga import Manga


class LibraryEntryBase(BaseModel):
    manga_id: int
    status: StatusEnum = StatusEnum.PLAN_TO_READ
    progress: int = 0


class LibraryEntryCreate(LibraryEntryBase):
    pass


class LibraryEntryUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    progress: Optional[int] = None


class LibraryEntryInDB(LibraryEntryBase):
    user_id: int

    class Config:
        from_attributes = True


class LibraryEntry(LibraryEntryInDB):
    """Library entry model returned to clients"""
    manga: Optional[Manga] = None


class LibraryList(BaseModel):
    entries: List[LibraryEntry] 