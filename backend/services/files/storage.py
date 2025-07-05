import logging
import aiofiles
from pathlib import Path
from datetime import datetime, timezone
from fastapi import UploadFile, HTTPException

from config import settings
from models.file_metadata import FileType
from utils.datetime import add_days_to_date

logger = logging.getLogger(__name__)

class FileStorage:
    def __init__(self):
        self.base_path = Path(settings.BASE_STORAGE_PATH)
        self.max_size = settings.MAX_FILE_SIZE
        self.allowed_extensions = settings.ALLOWED_EXTENSIONS

    async def save_file(self, file: UploadFile, user_id: str) -> dict:
        """Save uploaded file to disk and return file metadata"""
        try:
            # Validate file
            self._validate_file(file)
            
            # Create user directory
            user_dir = self.base_path / user_id
            user_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename
            timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
            file_ext = Path(file.filename).suffix.lower()
            filename = f"{timestamp}_{file.filename}"
            file_path = user_dir / filename
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Get file stats
            file_size = file_path.stat().st_size
            file_type = self._get_file_type(file_ext)
            
            return {
                'file_path': str(file_path),
                'original_filename': file.filename,
                'file_size': file_size,
                'file_type': file_type,
                'mime_type': file.content_type,
                'expires_at': add_days_to_date(datetime.now(timezone.utc), settings.DEFAULT_FILE_TTL_DAYS)
            }
            
        except Exception as e:
            logger.error(f"Failed to save file {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from disk"""
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                logger.info(f"Deleted file: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {e}")
            return False

    def _validate_file(self, file: UploadFile):
        """Validate uploaded file"""
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in self.allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Allowed types: {', '.join(self.allowed_extensions)}"
            )
        
        # Note: file.size is not always available in FastAPI
        # We'll check size after reading the file if needed

    def _get_file_type(self, file_ext: str) -> FileType:
        """Determine file type from extension"""
        if file_ext == '.pdf':
            return FileType.PDF
        elif file_ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
            return FileType.IMAGE
        else:
            raise ValueError(f"Unsupported file extension: {file_ext}")

    def get_user_directory(self, user_id: str) -> Path:
        """Get user's storage directory"""
        return self.base_path / user_id
    
    async def get_user_storage_usage(self, user_id: str) -> dict:
        """Get storage usage statistics for a user"""
        user_dir = self.get_user_directory(user_id)
        if not user_dir.exists():
            return {'total_size': 0, 'file_count': 0}
        
        total_size = 0
        file_count = 0
        
        for file_path in user_dir.rglob('*'):
            if file_path.is_file():
                total_size += file_path.stat().st_size
                file_count += 1
        
        return {
            'total_size': total_size,
            'file_count': file_count,
            'total_size_mb': round(total_size / (1024 * 1024), 2)
        }

# Global storage instance
storage = FileStorage()