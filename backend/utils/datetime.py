from datetime import datetime, timedelta, timezone
from typing import Optional
import re

def format_date_dd_mm_yyyy(date: datetime) -> str:
    #Format datetime to dd/mm/yyyy string
    return date.strftime("%d/%m/%Y")

def format_datetime_dd_mm_yyyy(date: datetime) -> str:
    #Format datetime to dd/mm/yyyy HH:MM string
    return date.strftime("%d/%m/%Y %H:%M")

def parse_date_dd_mm_yyyy(date_str: str) -> Optional[datetime]:
    #Parse dd/mm/yyyy string to datetime
    try:
        return datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        return None

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
    #Calculate days until target date
    now = datetime.now(timezone.utc)
    delta = target_date - now
    return delta.days

def calculate_days_since(past_date: datetime) -> int:
    #Calculate days since past date
    now = datetime.now(timezone.utc)
    delta = now - past_date
    return delta.days

def is_date_expired(date: datetime) -> bool:
    #Check if date has passed
    return date < datetime.now(timezone.utc)

def is_date_expiring_soon(date: datetime, days_ahead: int = 30) -> bool:
    #Check if date is expiring within specified days
    cutoff = datetime.now(timezone.utc) + timedelta(days=days_ahead)
    return datetime.now(timezone.utc) <= date <= cutoff

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

def get_date_range_filter(start_date: Optional[datetime], end_date: Optional[datetime]) -> dict:
    #Generate MongoDB date range filter
    date_filter = {}
    
    if start_date:
        date_filter["$gte"] = start_date
    if end_date:
        date_filter["$lte"] = end_date
        
    return date_filter if date_filter else {}

def normalize_date_to_start_of_day(date: datetime) -> datetime:
    #Normalize datetime to start of day (00:00:00)
    return date.replace(hour=0, minute=0, second=0, microsecond=0)

def normalize_date_to_end_of_day(date: datetime) -> datetime:
    #Normalize datetime to end of day (23:59:59)
    return date.replace(hour=23, minute=59, second=59, microsecond=999999)

def extract_dates_from_text(text: str) -> list[datetime]:
    #Extract dates from text using regex patterns
    dates = []
    
    # Pattern for dd/mm/yyyy
    pattern = r'\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b'
    matches = re.findall(pattern, text)
    
    for match in matches:
        day, month, year = match
        try:
            date = datetime(int(year), int(month), int(day))
            dates.append(date)
        except ValueError:
            continue
    
    return dates

def get_warranty_duration_text(start_date: datetime, end_date: datetime) -> str:
    #Get human-readable warranty duration
    delta = end_date - start_date
    years = delta.days // 365
    months = (delta.days % 365) // 30
    
    if years > 0:
        if months > 0:
            return f"{years} year{'s' if years > 1 else ''}, {months} month{'s' if months > 1 else ''}"
        else:
            return f"{years} year{'s' if years > 1 else ''}"
    elif months > 0:
        return f"{months} month{'s' if months > 1 else ''}"
    else:
        return f"{delta.days} day{'s' if delta.days > 1 else ''}"