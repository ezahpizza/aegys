import logging
from typing import Optional
from pymongo import AsyncMongoClient
from config import settings

logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self):
        self.client: Optional[AsyncMongoClient] = None
        self.db = None

    async def connect(self):
        try:
            self.client = AsyncMongoClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]
            await self.client.admin.command('ping')
            logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    async def disconnect(self):
        if self.client:
            await self.client.close()
            logger.info("Disconnected from MongoDB")

    def get_file_collection(self):
        if self.db is None:
            raise RuntimeError("Database not connected")
        return self.db["files"]

    def get_user_collection(self):
        if self.db is None:
            raise RuntimeError("Database not connected")
        return self.db["users"]

    def get_alerts_collection(self):
        if self.db is None:
            raise RuntimeError("Database not connected")
        return self.db["alerts"]

mongodb = MongoDB()