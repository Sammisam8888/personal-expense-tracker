from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from beanie import Document, Link

class User(Document):
    email: EmailStr
    hashed_password: str

    class Settings:
        name = "users"

class Transaction(Document):
    user_id: str
    type: str # "income" | "expense"
    amount: float
    currency: str = "INR"
    category: str
    description: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "transactions"

# Pydantic models for API
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TransactionCreate(BaseModel):
    type: str
    amount: float
    currency: str = "INR"
    category: str
    description: Optional[str] = None
    date: Optional[datetime] = None

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None

class TransactionOut(BaseModel):
    id: str
    user_id: str
    type: str
    amount: float
    currency: str
    category: str
    description: Optional[str]
    date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
