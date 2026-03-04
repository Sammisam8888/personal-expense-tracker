from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from beanie import PydanticObjectId

from database import init_db
from models import (
    UserRegister, User, Transaction, TransactionCreate, TransactionUpdate, TransactionOut
)
import auth

app = FastAPI(title="Expense Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.post("/auth/register")
async def register(req: UserRegister):
    user = await User.find_one(User.email == req.email)
    if user:
        raise HTTPException(400, "Email already registered")
    
    new_user = User(
        email=req.email,
        hashed_password=auth.hash_pw(req.password)
    )
    await new_user.insert()
    return {"msg": "User created"}

@app.post("/auth/login")
async def login(req: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == req.username)
    if not user or not auth.verify_pw(req.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    
    token = auth.create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/transactions", response_model=List[TransactionOut])
async def list_transactions(month: Optional[str] = None, current_user: User = Depends(auth.get_current_user)):
    query = {"user_id": str(current_user.id)}
    if month:
        try:
            start_date = datetime.strptime(month, "%Y-%m")
            if start_date.month == 12:
                end_date = start_date.replace(year=start_date.year + 1, month=1)
            else:
                end_date = start_date.replace(month=start_date.month + 1)
            query["date"] = {"$gte": start_date, "$lt": end_date}
        except ValueError:
            pass

    txs = await Transaction.find(query).sort("-date").to_list()
    out = []
    for t in txs:
        d = t.dict()
        d["id"] = str(t.id)
        out.append(TransactionOut(**d))
    return out

@app.post("/transactions", response_model=TransactionOut)
async def create_transaction(req: TransactionCreate, current_user: User = Depends(auth.get_current_user)):
    tx = Transaction(
        user_id=str(current_user.id),
        type=req.type,
        amount=req.amount,
        currency=req.currency,
        category=req.category,
        description=req.description,
        date=req.date or datetime.utcnow()
    )
    await tx.insert()
    d = tx.dict()
    d["id"] = str(tx.id)
    return TransactionOut(**d)

@app.get("/transactions/{id}", response_model=TransactionOut)
async def get_transaction(id: str, current_user: User = Depends(auth.get_current_user)):
    try:
        tx = await Transaction.get(PydanticObjectId(id))
    except:
        raise HTTPException(404, "Not found")
    if not tx or tx.user_id != str(current_user.id):
        raise HTTPException(404, "Not found")
    d = tx.dict()
    d["id"] = str(tx.id)
    return TransactionOut(**d)

@app.put("/transactions/{id}", response_model=TransactionOut)
async def update_transaction(id: str, req: TransactionUpdate, current_user: User = Depends(auth.get_current_user)):
    try:
        tx = await Transaction.get(PydanticObjectId(id))
    except:
        raise HTTPException(404, "Not found")
    if not tx or tx.user_id != str(current_user.id):
        raise HTTPException(404, "Not found")
    
    update_data = req.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(tx, k, v)
    tx.updated_at = datetime.utcnow()
    await tx.save()
    
    d = tx.dict()
    d["id"] = str(tx.id)
    return TransactionOut(**d)

@app.delete("/transactions/{id}")
async def delete_transaction(id: str, current_user: User = Depends(auth.get_current_user)):
    try:
        tx = await Transaction.get(PydanticObjectId(id))
    except:
        raise HTTPException(404, "Not found")
    if not tx or tx.user_id != str(current_user.id):
        raise HTTPException(404, "Not found")
    await tx.delete()
    return {"msg": "Deleted successfully"}

@app.get("/summary")
async def get_summary(month: Optional[str] = None, current_user: User = Depends(auth.get_current_user)):
    query = {"user_id": str(current_user.id)}
    if month:
        try:
            start_date = datetime.strptime(month, "%Y-%m")
            if start_date.month == 12:
                end_date = start_date.replace(year=start_date.year + 1, month=1)
            else:
                end_date = start_date.replace(month=start_date.month + 1)
            query["date"] = {"$gte": start_date, "$lt": end_date}
        except ValueError:
            pass

    txs = await Transaction.find(query).to_list()
    total_in = sum(t.amount for t in txs if t.type == "income")
    total_out = sum(t.amount for t in txs if t.type == "expense")
    
    cat_breakdown = {}
    for t in txs:
        if t.type == "expense":
            cat_breakdown[t.category] = cat_breakdown.get(t.category, 0) + t.amount
            
    return {
        "total_income": total_in,
        "total_expense": total_out,
        "balance": total_in - total_out,
        "category_breakdown": cat_breakdown
    }
