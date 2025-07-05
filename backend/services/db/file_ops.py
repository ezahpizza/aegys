import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import ASCENDING, DESCENDING
from db.client import mongodb
from models.file_metadata import FileMetadata, FileStatus, WarrantyData
from config import settings
from utils.datetime import add_days_to_date

logger = logging.getLogger(__name__)

class FileOperations:
    def __init__(self):
        self.collection = None

    async def _get_collection(self):
        """Get file collection with lazy initialization"""
        if self.collection is None:
            self.collection = mongodb.get_file_collection()
        return self.collection

    async def create_file_record(self, file_data: dict) -> str:
        """Create a new file record in database"""
        try:
            collection = await self._get_collection()
            file_metadata = FileMetadata(**file_data)
            result = await collection.insert_one(file_metadata.dict(by_alias=True))
            logger.info(f"Created file record: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Failed to create file record: {e}")
            raise

    async def get_file_by_id(self, file_id: str, user_id: str) -> Optional[FileMetadata]:
        """Get file by ID for specific user"""
        try:
            collection = await self._get_collection()
            doc = await collection.find_one({
                "_id": ObjectId(file_id),
                "user_id": user_id
            })
            return FileMetadata(**doc) if doc else None
        except Exception as e:
            logger.error(f"Failed to get file {file_id}: {e}")
            return None

    async def get_files_by_user(self, user_id: str, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """Get paginated files for user"""
        try:
            collection = await self._get_collection()
            skip = (page - 1) * page_size
            
            cursor = collection.find({"user_id": user_id}).sort("uploaded_at", DESCENDING)
            total = await collection.count_documents({"user_id": user_id})
            
            files = []
            async for doc in cursor.skip(skip).limit(page_size):
                files.append(FileMetadata(**doc))
            
            return {
                "files": files,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        except Exception as e:
            logger.error(f"Failed to get files for user {user_id}: {e}")
            raise

    async def update_file_status(self, file_id: str, status: FileStatus, error_message: Optional[str] = None) -> bool:
        """Update file processing status"""
        try:
            collection = await self._get_collection()
            update_data = {
                "status": status.value,
                "processed_at": datetime.now(timezone.utc)
            }
            
            if error_message:
                update_data["error_message"] = error_message
                update_data["$inc"] = {"processing_attempts": 1}
            
            result = await collection.update_one(
                {"_id": ObjectId(file_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update status for file {file_id}: {e}")
            return False

    async def update_extracted_text(self, file_id: str, extracted_text: str) -> bool:
        """Update extracted text for file"""
        try:
            collection = await self._get_collection()
            result = await collection.update_one(
                {"_id": ObjectId(file_id)},
                {"$set": {"extracted_text": extracted_text}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update extracted text for file {file_id}: {e}")
            return False

    async def update_warranty_data(self, file_id: str, warranty_data: WarrantyData) -> bool:
        """Update parsed warranty data"""
        try:
            collection = await self._get_collection()
            result = await collection.update_one(
                {"_id": ObjectId(file_id)},
                {
                    "$set": {
                        "warranty_data": warranty_data.dict(),
                        "status": FileStatus.PROCESSED.value,
                        "processed_at": datetime.now(timezone.utc)
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update warranty data for file {file_id}: {e}")
            return False

    async def delete_file_record(self, file_id: str, user_id: str) -> bool:
        """Delete file record from database"""
        try:
            collection = await self._get_collection()
            result = await collection.delete_one({
                "_id": ObjectId(file_id),
                "user_id": user_id
            })
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Failed to delete file record {file_id}: {e}")
            return False

    async def get_expiring_files(self, user_id: str, days_ahead: int = None) -> List[FileMetadata]:
        """Get files with warranties expiring soon"""
        try:
            collection = await self._get_collection()
            days = days_ahead or settings.ALERT_EXPIRY_DAYS
            cutoff_date = add_days_to_date(datetime.now(timezone.utc), days)
            
            cursor = collection.find({
                "user_id": user_id,
                "status": FileStatus.PROCESSED.value,
                "warranty_data.warranty_end": {
                    "$lte": cutoff_date,
                    "$gte": datetime.now(timezone.utc)
                }
            }).sort("warranty_data.warranty_end", ASCENDING)
            
            files = []
            async for doc in cursor:
                files.append(FileMetadata(**doc))
            
            return files
        except Exception as e:
            logger.error(f"Failed to get expiring files for user {user_id}: {e}")
            return []

    async def get_expired_files(self, batch_size: int = None) -> List[FileMetadata]:
        """Get files that have passed their expiry date"""
        try:
            collection = await self._get_collection()
            batch_size = batch_size or settings.CLEANUP_BATCH_SIZE
            
            cursor = collection.find({
                "expires_at": {"$lt": datetime.now(timezone.utc)}
            }).limit(batch_size)
            
            files = []
            async for doc in cursor:
                files.append(FileMetadata(**doc))
            
            return files
        except Exception as e:
            logger.error(f"Failed to get expired files: {e}")
            return []

    async def bulk_delete_files(self, file_ids: List[str]) -> int:
        """Delete multiple files by ID"""
        try:
            collection = await self._get_collection()
            object_ids = [ObjectId(file_id) for file_id in file_ids]
            result = await collection.delete_many({"_id": {"$in": object_ids}})
            return result.deleted_count
        except Exception as e:
            logger.error(f"Failed to bulk delete files: {e}")
            return 0

    async def get_user_file_count(self, user_id: str) -> int:
        """Get total file count for user"""
        try:
            collection = await self._get_collection()
            return await collection.count_documents({"user_id": user_id})
        except Exception as e:
            logger.error(f"Failed to get file count for user {user_id}: {e}")
            return 0

    async def get_files_by_status(self, status: FileStatus, limit: int = 100) -> List[FileMetadata]:
        """Get files by processing status"""
        try:
            collection = await self._get_collection()
            cursor = collection.find({"status": status.value}).limit(limit)
            
            files = []
            async for doc in cursor:
                files.append(FileMetadata(**doc))
            
            return files
        except Exception as e:
            logger.error(f"Failed to get files by status {status}: {e}")
            return []

# Global file operations instance
file_ops = FileOperations()