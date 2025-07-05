from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from enum import Enum

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class FileStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    DELETED = "deleted"

class FileType(str, Enum):
    PDF = "pdf"
    IMAGE = "image"

class WarrantyData(BaseModel):
    device_name: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    purchase_date: Optional[datetime] = None
    warranty_start: Optional[datetime] = None
    warranty_end: Optional[datetime] = None
    warranty_period: Optional[str] = None
    coverage_details: Optional[str] = None
    exclusions: Optional[str] = None
    contact_info: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = None

class FileMetadata(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    original_filename: str
    file_path: str
    file_type: FileType
    file_size: int
    mime_type: str
    
    # Processing status
    status: FileStatus = FileStatus.UPLOADED
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    
    # Extracted content
    extracted_text: Optional[str] = None
    
    # Parsed warranty data
    warranty_data: Optional[WarrantyData] = None
    
    # Expiry management
    expires_at: Optional[datetime] = None
    
    # Error handling
    error_message: Optional[str] = None
    processing_attempts: int = 0
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class FileUploadRequest(BaseModel):
    user_id: str

class FileUploadResponse(BaseModel):
    file_id: str
    original_filename: str
    file_size: int
    status: FileStatus
    uploaded_at: datetime

class FileListResponse(BaseModel):
    files: List[FileMetadata]
    total: int
    page: int
    page_size: int

class FileDetailResponse(BaseModel):
    file: FileMetadata

class LLMParseRequest(BaseModel):
    file_id: str

class LLMParseResponse(BaseModel):
    file_id: str
    warranty_data: Optional[WarrantyData]
    status: FileStatus
    processed_at: datetime

class AlertItem(BaseModel):
    file_id: str
    device_name: Optional[str]
    warranty_end: Optional[datetime]
    days_until_expiry: int

class AlertsResponse(BaseModel):
    alerts: List[AlertItem]
    total: int

class CleanupResponse(BaseModel):
    deleted_count: int
    processed_at: datetime