from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import User, Transaction

async def init_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    database = client.expense_tracker
    await init_beanie(database, document_models=[User, Transaction])
