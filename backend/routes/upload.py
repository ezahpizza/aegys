import logging
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from models.file_metadata import FileStatus, FileUploadResponse
from services.files.storage import storage
from services.files.extractor import extractor
from services.db.file_ops import file_ops

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    """
    Upload and process a warranty document
    
    - Saves file to storage
    - Extracts text content
    - Creates database record
    - Returns upload metadata
    """
    try:
        logger.info(f"Processing file upload: {file.filename} for user: {user_id}")
        
        # Validate and save file
        file_metadata = await storage.save_file(file, user_id)
        
        # Prepare database record
        db_record = {
            "user_id": user_id,
            "file_path": file_metadata["file_path"],
            "original_filename": file_metadata["original_filename"],
            "file_size": file_metadata["file_size"],
            "file_type": file_metadata["file_type"],
            "mime_type": file_metadata["mime_type"],
            "status": FileStatus.UPLOADED,
            "uploaded_at": datetime.now(timezone.utc),
            "expires_at": file_metadata["expires_at"],
            "processing_attempts": 0
        }
        
        # Create database record
        file_id = await file_ops.create_file_record(db_record)
        
        # Extract text content
        try:
            await file_ops.update_file_status(file_id, FileStatus.PROCESSING)
            
            # Validate file before extraction
            is_valid = await extractor.validate_file_content(
                file_metadata["file_path"], 
                file_metadata["file_type"]
            )
            
            if not is_valid:
                await file_ops.update_file_status(
                    file_id, 
                    FileStatus.FAILED, 
                    "File validation failed"
                )
                raise HTTPException(status_code=400, detail="Invalid file format")
            
            # Extract text
            extracted_text = await extractor.extract_text_from_file(
                file_metadata["file_path"],
                file_metadata["file_type"]
            )
            
            # Update database with extracted text
            await file_ops.update_extracted_text(file_id, extracted_text)
            await file_ops.update_file_status(file_id, FileStatus.TEXT_EXTRACTED)
            
            logger.info(f"Successfully processed upload: {file_id}")
            
            return FileUploadResponse(
                file_id=file_id,
                original_filename=file_metadata["original_filename"],
                file_size=file_metadata["file_size"],
                status=FileStatus.TEXT_EXTRACTED,
                uploaded_at=datetime.now(timezone.utc),
            )
            
        except Exception as e:
            logger.error(f"Text extraction failed for file {file_id}: {e}")
            await file_ops.update_file_status(
                file_id, 
                FileStatus.FAILED, 
                f"Text extraction failed: {str(e)}"
            )
            
            return FileUploadResponse(
                file_id=file_id,
                original_filename=file_metadata["original_filename"],
                file_size=file_metadata["file_size"],
                status=FileStatus.FAILED,
                uploaded_at=datetime.now(timezone.utc),
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed for {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/validate")
async def validate_file(file: UploadFile = File(...)):
    """
    Validate file before upload without saving
    
    - Checks file type and size
    - Returns validation result
    """
    try:
        # Check file extension
        from pathlib import Path
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in storage.allowed_extensions:
            return JSONResponse(
                status_code=400,
                content={
                    "valid": False,
                    "error": f"File type not allowed. Allowed types: {', '.join(storage.allowed_extensions)}"
                }
            )
        
        # Check file size
        content = await file.read()
        file_size = len(content)
        
        if file_size > storage.max_size:
            return JSONResponse(
                status_code=400,
                content={
                    "valid": False,
                    "error": f"File size exceeds limit of {storage.max_size / (1024*1024):.1f}MB"
                }
            )
        
        # Reset file pointer
        await file.seek(0)
        
        return JSONResponse(
            status_code=200,
            content={
                "valid": True,
                "file_size": file_size,
                "file_type": storage._get_file_type(file_ext).value,
                "message": "File validation passed"
            }
        )
        
    except Exception as e:
        logger.error(f"File validation failed: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "valid": False,
                "error": f"Validation failed: {str(e)}"
            }
        )