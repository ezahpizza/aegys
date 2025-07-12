import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from db.client import mongodb
from routes import upload, files, llm, cleanup, user

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await mongodb.connect()
        logging.info("aegys backend started successfully")
    except Exception as e:
        logging.error(f"Failed to start application: {e}")
        raise
    
    yield
    
    # Shutdown
    try:
        await mongodb.disconnect()
        logging.info("aegys backend shutdown complete")
    except Exception as e:
        logging.error(f"Error during shutdown: {e}")

# Create FastAPI app
app = FastAPI(
    title="aegys API",
    description="Warranty and bill organizer backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(files.router, prefix="/files", tags=["files"])
app.include_router(llm.router, prefix="/llm", tags=["llm"])
app.include_router(cleanup.router, prefix="/cleanup", tags=["cleanup"])
app.include_router(user.router, prefix="/user", tags=["user"])


@app.get("/")
async def root():
    return {"message": "aegys API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    try:
        await mongodb.client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
