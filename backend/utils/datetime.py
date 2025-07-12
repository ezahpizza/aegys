from datetime import datetime, timedelta, timezone
from typing import Optional

def parse_flexible_date(date_str: str) -> Optional[datetime]:
    #Parse various date formats to datetime
    if not date_str:
        return None
    
    # Common date patterns
    patterns = [
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%d.%m.%Y",
        "%d %m %Y",
        "%d/%m/%y",
        "%d-%m-%y",
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%m/%d/%Y",
        "%m-%d-%Y",
    ]
    
    for pattern in patterns:
        try:
            return datetime.strptime(date_str.strip(), pattern)
        except ValueError:
            continue
    
    return None

def calculate_days_until(target_date: datetime) -> int:
    now = datetime.now(timezone.utc)
    if target_date.tzinfo is None:
        target_date = target_date.replace(tzinfo=timezone.utc)
    delta = target_date - now
    return delta.days

def get_expiry_warning_level(date: datetime) -> str:
    #Get warning level based on days until expiry
    days_until = calculate_days_until(date)
    
    if days_until < 0:
        return "expired"
    elif days_until <= 7:
        return "critical"
    elif days_until <= 30:
        return "warning"
    elif days_until <= 90:
        return "notice"
    else:
        return "normal"

def add_days_to_date(date: datetime, days: int) -> datetime:
    #Add days to a date
    return date + timedelta(days=days)
