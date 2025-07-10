import logging
from fastapi import APIRouter, HTTPException, Query, Path
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path as PathlibPath
from datetime import datetime, timezone

from models.file_metadata import FileStatus
from services.db.file_ops import file_ops
from services.files.storage import storage
from utils.datetime import get_expiry_warning_level

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{user_id}/stats")
async def get_user_file_stats(
    user_id: str = Path(..., description="User ID")
):
    """
    Get file statistics for a user
    
    - Total file count
    - Storage usage
    - Files by status
    - Expiring warranties count
    """
    try:
        logger.info(f"Fetching file stats for user {user_id}")
        
        # Get total file count
        total_files = await file_ops.get_user_file_count(user_id)
        
        # Get storage usage
        storage_usage = await storage.get_user_storage_usage(user_id)
        
        # Get files by status
        all_files = await file_ops.get_files_by_user(user_id, 1, 1000)  # Get all files
        
        status_counts = {}
        for status in FileStatus:
            status_counts[status.value] = sum(1 for f in all_files["files"] if f.status == status)
        
        # Get expiring warranties
        expiring_files = await file_ops.get_expiring_files(user_id, 30)
        
        return JSONResponse(
            status_code=200,
            content={
                "total_files": total_files,
                "storage_usage": storage_usage,
                "files_by_status": status_counts,
                "expiring_warranties": len(expiring_files),
                "processed_files": status_counts.get(FileStatus.PROCESSED.value, 0),
                "failed_files": status_counts.get(FileStatus.FAILED.value, 0)
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to fetch stats for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")

@router.get("/{user_id}/expiring")
async def get_expiring_warranties(
    user_id: str = Path(..., description="User ID"),
    days_ahead: int = Query(30, ge=1, le=365, description="Days ahead to check")
):
    """
    Get files with warranties expiring soon
    
    - Returns files with expiry warnings
    - Configurable lookahead period
    - Sorted by expiry date
    """
    try:
        logger.info(f"Fetching expiring warranties for user {user_id}")
        
        # Get expiring files
        expiring_files = await file_ops.get_expiring_files(user_id, days_ahead)
        
        # Convert to response format
        expiring_responses = []
        for file_metadata in expiring_files:
            if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end:
                file_metadata.expiry_warning = get_expiry_warning_level(file_metadata.warranty_data.warranty_end) if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end else None
                
                expiring_responses.append(file_metadata)
        
        return JSONResponse(
            status_code=200,
            content={
                "expiring_files": [f.dict() for f in expiring_responses],
                "count": len(expiring_responses),
                "days_ahead": days_ahead
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to fetch expiring warranties for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch expiring warranties: {str(e)}")

@router.post("/{user_id}/cleanup")
async def cleanup_user_files(
    user_id: str = Path(..., description="User ID"),
    dry_run: bool = Query(False, description="Preview cleanup without deleting")
):
    """
    Clean up expired files for a user
    
    - Removes files past their expiry date
    - Supports dry run mode for preview
    - Returns cleanup summary
    """
    try:
        logger.info(f"Starting cleanup for user {user_id}, dry_run: {dry_run}")
        
        # Get user's files
        all_files = await file_ops.get_files_by_user(user_id, 1, 1000)
        
        # Find expired files
        expired_files = [
            f for f in all_files["files"] 
            if f.expires_at and 
               (
                   (f.expires_at.tzinfo is None and f.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc))
                   or
                   (f.expires_at.tzinfo is not None and f.expires_at < datetime.now(timezone.utc))
               )
        ]
        
        cleanup_summary = {
            "total_files": len(all_files["files"]),
            "expired_files": len(expired_files),
            "files_to_delete": [f.original_filename for f in expired_files],
            "dry_run": dry_run
        }
        
        if not dry_run and expired_files:
            # Delete files from storage
            deleted_from_storage = 0
            for file_metadata in expired_files:
                if await storage.delete_file(file_metadata.file_path):
                    deleted_from_storage += 1
            
            # Delete database records
            file_ids = [str(f.id) for f in expired_files]
            deleted_from_db = await file_ops.bulk_delete_files(file_ids)
            
            cleanup_summary.update({
                "deleted_from_storage": deleted_from_storage,
                "deleted_from_db": deleted_from_db,
                "cleanup_completed": True
            })
        
        return JSONResponse(
            status_code=200,
            content=cleanup_summary
        )
        
    except Exception as e:
        logger.error(f"Cleanup failed for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")
    
@router.get("/view/{file_id}")
async def serve_pdf(user_id: str, file_id: str):
    """
    Serve a PDF file for viewing/downloading on the client side using file_id.
    """
    file_metadata = await file_ops.get_file_by_id(file_id, user_id)
    if not file_metadata:
        raise HTTPException(status_code=404, detail=f"File not found for file_id={file_id}, user_id={user_id}")

    file_path = file_metadata.file_path

    path_obj = PathlibPath(file_path)
    logger.info(f"Resolved file_path: {file_path}")

    if not path_obj.exists() or not path_obj.is_file():
        raise HTTPException(status_code=404, detail=f"File not found on disk: {file_path}")

    logger.info(f"Serving PDF file: {file_path}")
    return FileResponse(
        path=str(path_obj),
        media_type="application/pdf",
        filename=file_metadata.original_filename
    )