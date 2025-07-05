import logging
from typing import List, Dict
from fastapi import APIRouter, HTTPException, BackgroundTasks, Query, Header
from datetime import datetime, timezone

from services.alerts.scheduler import scheduler
from models.file_metadata import AlertItem, CleanupScheduleRequest, CleanupResponse, AlertsResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/schedule", response_model=CleanupResponse)
async def schedule_cleanup(
    request: CleanupScheduleRequest,
    background_tasks: BackgroundTasks
):
    """
    Schedule cleanup of expired files
    Internal endpoint for cron jobs or admin tasks
    """
    try:
        logger.info(f"Cleanup scheduled - force: {request.force}, batch_size: {request.batch_size}")
        
        # Execute cleanup task
        result = await scheduler.schedule_cleanup_task()
        
        if result.get('error'):
            raise HTTPException(
                status_code=500,
                detail=f"Cleanup task failed: {result['error']}"
            )
        
        return CleanupResponse(
            deleted_count=result.get('deleted_count', 0),
            storage_deleted=result.get('storage_deleted', 0),
            db_deleted=result.get('db_deleted', 0),
            processed_at=result.get('processed_at', datetime.now(timezone.utc)),
            message=result.get('message', 'Cleanup completed'),
            error=result.get('error')
        )
        
    except Exception as e:
        logger.error(f"Cleanup scheduling failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to schedule cleanup: {str(e)}"
        )

@router.get("/alerts", response_model=AlertsResponse)
async def get_warranty_alerts(
    user_id: str = Header(..., description="User ID from auth header"),
):
    """
    Get warranty expiry alerts for a user
    Returns categorized alerts by severity level
    """
    try:
        logger.info(f"Getting warranty alerts for user: {user_id}")
        
        # Get comprehensive alert summary
        alert_summary = await scheduler.get_user_alert_summary(user_id)
        
        if alert_summary.get('error'):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get alerts: {alert_summary['error']}"
            )
        
        return AlertsResponse(**alert_summary)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get warranty alerts for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve warranty alerts: {str(e)}"
        )

@router.get("/alerts/expiring", response_model=List[AlertItem])
async def get_expiring_warranties(
    user_id: str = Header(..., description="User ID from auth header"),
    days_ahead: int = Query(30, description="Days ahead to check for expiries")
):
    """
    Get simple list of expiring warranties
    Returns flat list of alerts within specified days
    """
    try:
        logger.info(f"Getting expiring warranties for user: {user_id} within {days_ahead} days")
        
        alerts = await scheduler.scan_warranty_expiries(user_id, days_ahead)
        return alerts
        
    except Exception as e:
        logger.error(f"Failed to get expiring warranties for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve expiring warranties: {str(e)}"
        )

@router.get("/alerts/severity", response_model=Dict[str, List[AlertItem]])
async def get_alerts_by_severity(
    user_id: str = Header(..., description="User ID from auth header")
):
    """
    Get alerts grouped by severity levels
    Returns dictionary with expired, critical, warning, notice categories
    """
    try:
        logger.info(f"Getting alerts by severity for user: {user_id}")
        
        alerts_by_severity = await scheduler.get_alerts_by_severity(user_id)
        return alerts_by_severity
        
    except Exception as e:
        logger.error(f"Failed to get alerts by severity for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve alerts by severity: {str(e)}"
        )

@router.post("/background/start")
async def start_background_cleanup(
    interval_hours: int = Query(24, description="Cleanup interval in hours")
):
    """
    Start background cleanup task
    Internal endpoint for system initialization
    """
    try:
        logger.info(f"Starting background cleanup with {interval_hours}h interval")
        
        if interval_hours < 1 or interval_hours > 168:  # 1 hour to 7 days
            raise HTTPException(
                status_code=400,
                detail="Interval must be between 1 and 168 hours"
            )
        
        # Start background task
        task = scheduler.start_background_task(
            scheduler.run_background_cleanup(interval_hours),
            f"background_cleanup_{interval_hours}h"
        )
        
        return {
            "message": f"Background cleanup started with {interval_hours}h interval",
            "task_id": id(task),
            "started_at": datetime.now(timezone.utc)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to start background cleanup: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start background cleanup: {str(e)}"
        )
    
@router.post("/background/stop")
async def stop_background_cleanup():
    """
    Stop all background cleanup tasks
    Internal endpoint for system shutdown
    """
    try:
        logger.info("Stopping background cleanup tasks")
        
        await scheduler.stop_all_background_tasks()
        
        return {
            "message": "All background cleanup tasks stopped",
            "stopped_at": datetime.now(timezone.utc)
        }
        
    except Exception as e:
        logger.error(f"Failed to stop background cleanup: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to stop background cleanup: {str(e)}"
        )
