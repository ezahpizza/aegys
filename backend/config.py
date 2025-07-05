from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    MONGODB_URL: str = Field(..., env="MONGODB_URL")
    DATABASE_NAME: str = Field(..., env="DATABASE_NAME")
    
    BASE_STORAGE_PATH: str = "/mnt/data/aegys"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"]
    
    DEFAULT_FILE_TTL_DAYS: int = 365  
    CLEANUP_BATCH_SIZE: int = 100
    
    GEMINI_API_KEY: str = Field(..., env="GEMINI_API_KEY")
    GEMINI_MODEL: str = Field("gemini-2.5-flash-preview-04-17", env="GEMINI_MODEL")
    GEMINI_TEMPERATURE: float = 0.3
    GEMINI_MAX_TOKENS: int = 2048
    
    TESSERACT_CMD: Optional[str] = None
    TESSERACT_LANG: str = "eng"
    
    ALERT_EXPIRY_DAYS: int = 30
    
    CORS_ORIGINS: str = Field(
        default="http://localhost:8080",
        env="CORS_ORIGINS"
    )

    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()