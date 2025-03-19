from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserInDB(UserBase):
    id: int
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    is_admin: bool = False

    class Config:
        from_attributes = True


class User(UserInDB):
    """User model returned to clients"""
    pass


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None 