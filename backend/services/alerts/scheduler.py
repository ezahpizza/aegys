import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from services.db.file_ops import file_ops
from services.files.storage import storage
from models.file_metadata import AlertItem
from utils.datetime import (
    calculate_days_until, 
    get_expiry_warning_level,
)
from config import settings

logger = logging.getLogger(__name__)

class AlertScheduler:
    """Service for managing warranty expiry alerts and file cleanup scheduling"""
    
    def __init__(self):
        self.alert_days = settings.ALERT_EXPIRY_DAYS
        self.cleanup_batch_size = settings.CLEANUP_BATCH_SIZE
        self._running_tasks = set()
    
    async def scan_warranty_expiries(self, user_id: str, days_ahead: Optional[int] = None) -> List[AlertItem]:
        """Scan for warranties expiring within specified days"""
        try:
            days = days_ahead or self.alert_days
            logger.info(f"Scanning warranty expiries for user {user_id} within {days} days")
            
            # Get files with expiring warranties
            expiring_files = await file_ops.get_expiring_files(user_id, days)
            
            alerts = []
            for file_metadata in expiring_files:
                if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end:
                    days_until_expiry = calculate_days_until(file_metadata.warranty_data.warranty_end)
                    
                    alert = AlertItem(
                        file_id=str(file_metadata.id),
                        device_name=file_metadata.warranty_data.device_name,
                        warranty_end=file_metadata.warranty_data.warranty_end,
                        days_until_expiry=days_until_expiry
                    )
                    alerts.append(alert)
            
            # Sort by days until expiry (most urgent first)
            alerts.sort(key=lambda x: x.days_until_expiry)
            
            logger.info(f"Found {len(alerts)} warranty expiry alerts for user {user_id}")
            return alerts
            
        except Exception as e:
            logger.error(f"Failed to scan warranty expiries for user {user_id}: {e}")
            return []
    
    async def get_alerts_by_severity(self, user_id: str) -> Dict[str, List[AlertItem]]:
        """Get alerts categorized by severity level"""
        try:
            # Get all expiring files (extended range for categorization)
            expiring_files = await file_ops.get_expiring_files(user_id, 90)
            
            severity_alerts = {
                'expired': [],
                'critical': [],  # <= 7 days
                'warning': [],   # <= 30 days
                'notice': []     # <= 90 days
            }
            
            for file_metadata in expiring_files:
                if file_metadata.warranty_data and file_metadata.warranty_data.warranty_end:
                    warranty_end = file_metadata.warranty_data.warranty_end
                    warning_level = get_expiry_warning_level(warranty_end)
                    days_until_expiry = calculate_days_until(warranty_end)
                    
                    alert = AlertItem(
                        file_id=str(file_metadata.id),
                        device_name=file_metadata.warranty_data.device_name,
                        warranty_end=warranty_end,
                        days_until_expiry=days_until_expiry
                    )
                    
                    if warning_level in severity_alerts:
                        severity_alerts[warning_level].append(alert)
            
            # Sort each category by days until expiry
            for category in severity_alerts:
                severity_alerts[category].sort(key=lambda x: x.days_until_expiry)
            
            return severity_alerts
            
        except Exception as e:
            logger.error(f"Failed to get alerts by severity for user {user_id}: {e}")
            return {'expired': [], 'critical': [], 'warning': [], 'notice': []}
    
    async def schedule_cleanup_task(self) -> Dict[str, Any]:
        """Schedule and execute cleanup of expired files"""
        try:
            logger.info("Starting scheduled cleanup task")
            
            # Get expired files
            expired_files = await file_ops.get_expired_files(self.cleanup_batch_size)
            
            if not expired_files:
                logger.info("No expired files found for cleanup")
                return {
                    'deleted_count': 0,
                    'processed_at': datetime.now(timezone.utc),
                    'message': 'No expired files found'
                }
            
            # Delete files from storage
            file_paths = [file_metadata.file_path for file_metadata in expired_files]
            storage_deleted = await storage.cleanup_expired_files(file_paths)
            
            # Delete records from database
            file_ids = [str(file_metadata.id) for file_metadata in expired_files]
            db_deleted = await file_ops.bulk_delete_files(file_ids)
            
            logger.info(f"Cleanup completed: {storage_deleted} files deleted from storage, {db_deleted} records deleted from database")
            
            return {
                'deleted_count': min(storage_deleted, db_deleted),
                'storage_deleted': storage_deleted,
                'db_deleted': db_deleted,
                'processed_at': datetime.now(timezone.utc),
                'message': f'Cleanup completed successfully'
            }
            
        except Exception as e:
            logger.error(f"Scheduled cleanup task failed: {e}")
            return {
                'deleted_count': 0,
                'processed_at': datetime.now(timezone.utc),
                'error': str(e)
            }
    
    async def run_background_cleanup(self, interval_hours: int = 24):
        """Run background cleanup task at specified intervals"""
        try:
            logger.info(f"Starting background cleanup with {interval_hours}h interval")
            
            while True:
                try:
                    await self.schedule_cleanup_task()
                    await asyncio.sleep(interval_hours * 3600)  # Convert hours to seconds
                except Exception as e:
                    logger.error(f"Background cleanup iteration failed: {e}")
                    await asyncio.sleep(300)  # Wait 5 minutes before retry
                    
        except asyncio.CancelledError:
            logger.info("Background cleanup task cancelled")
        except Exception as e:
            logger.error(f"Background cleanup task failed: {e}")
    
    async def get_user_alert_summary(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive alert summary for a user"""
        try:
            alerts_by_severity = await self.get_alerts_by_severity(user_id)
            
            # Calculate summary metrics
            total_alerts = sum(len(alerts) for alerts in alerts_by_severity.values())
            most_urgent = None
            
            # Find most urgent alert
            for severity in ['expired', 'critical', 'warning', 'notice']:
                if alerts_by_severity[severity]:
                    most_urgent = alerts_by_severity[severity][0]
                    break
            
            return {
                'user_id': user_id,
                'total_alerts': total_alerts,
                'expired_count': len(alerts_by_severity['expired']),
                'critical_count': len(alerts_by_severity['critical']),
                'warning_count': len(alerts_by_severity['warning']),
                'notice_count': len(alerts_by_severity['notice']),
                'most_urgent_alert': most_urgent,
                'alerts_by_severity': alerts_by_severity,
                'last_checked': datetime.now(timezone.utc)
            }
            
        except Exception as e:
            logger.error(f"Failed to get alert summary for user {user_id}: {e}")
            return {
                'user_id': user_id,
                'total_alerts': 0,
                'error': str(e),
                'last_checked': datetime.now(timezone.utc)
            }
    
    def start_background_task(self, coro, name: str):
        """Start a background task and track it"""
        task = asyncio.create_task(coro, name=name)
        self._running_tasks.add(task)
        task.add_done_callback(self._running_tasks.discard)
        return task
    
    async def stop_all_background_tasks(self):
        """Stop all running background tasks"""
        try:
            for task in self._running_tasks:
                task.cancel()
            
            if self._running_tasks:
                await asyncio.gather(*self._running_tasks, return_exceptions=True)
            
            logger.info("All background tasks stopped")
            
        except Exception as e:
            logger.error(f"Failed to stop background tasks: {e}")

# Global scheduler instance
scheduler = AlertScheduler()