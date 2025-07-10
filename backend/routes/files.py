import logging
from fastapi import APIRouter, HTTPException, Query, Path
from fastapi.responses import JSONResponse, FileResponse
from typing import Optional

from models.file_metadata import FileMetadata, FileListResponse, FileStatus
from services.db.file_ops import file_ops
from services.files.storage import storage
from utils.datetime import get_expiry_warning_level

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=FileListResponse)
async def get_user_files(
    user_id: str = Query(..., description="User ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[FileStatus] = Query(None, description="Filter by status")
):
    """
    Get paginated list of files for a user
    
    - Returns files with metadata and warranty information
    - Supports pagination and status filtering
    - Includes expiry warnings for processed files
    """
    try:
        logger.info(f"Fetching files for user {user_id}, page {page}")
        
        # Get files from database
        result = await file_ops.get_files_by_user(user_id, page, page_size)
        
        # Filter by status if provided
        if status:
            result["files"] = [f for f in result["files"] if f.status == status]
            result["total"] = len(result["files"])
        
        # Convert to response format
        file_responses = []
        for file_metadata in result["files"]:
            file_metadata.expiry_warning = get_expiry_warning_level(file_metadata.warranty_data.warranty_end) if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end else None
            
            file_responses.append(file_metadata)

        return FileListResponse(
            files=file_responses,
            total=result["total"],
            page=result["page"],
            page_size=result["page_size"],
            total_pages=(result["total"] + page_size - 1) // page_size
        )
        
    except Exception as e:
        logger.error(f"Failed to fetch files for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch files: {str(e)}")

@router.get("/{file_id}", response_model=FileMetadata)
async def get_file_details(
    file_id: str = Path(..., description="File ID"),
    user_id: str = Query(..., description="User ID")
):
    """
    Get detailed information about a specific file
    
    - Returns complete file metadata and warranty data
    - Includes extracted text if available
    - Shows processing status and any errors
    """
    try:
        logger.info(f"Fetching file details: {file_id} for user {user_id}")
        
        # Get file from database
        file_metadata = await file_ops.get_file_by_id(file_id, user_id)
        
        if not file_metadata:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Build response
        file_metadata.expiry_warning = get_expiry_warning_level(file_metadata.warranty_data.warranty_end) if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end else None
        
        return file_metadata
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch file {file_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch file: {str(e)}")

@router.delete("/{file_id}")
async def delete_file(
    file_id: str = Path(..., description="File ID"),
    user_id: str = Query(..., description="User ID")
):
    """
    Delete a file and its associated data
    
    - Removes file from storage
    - Deletes database record
    - Returns confirmation
    """
    try:
        logger.info(f"Deleting file: {file_id} for user {user_id}")
        
        # Get file metadata first
        file_metadata = await file_ops.get_file_by_id(file_id, user_id)
        
        if not file_metadata:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Delete file from storage
        file_deleted = await storage.delete_file(file_metadata.file_path)
        
        # Delete database record
        record_deleted = await file_ops.delete_file_record(file_id, user_id)
        
        if not record_deleted:
            raise HTTPException(status_code=500, detail="Failed to delete file record")
        
        logger.info(f"Successfully deleted file: {file_id}")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "File deleted successfully",
                "file_deleted": file_deleted,
                "record_deleted": record_deleted
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete file {file_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
