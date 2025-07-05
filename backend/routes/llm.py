import logging
from fastapi import APIRouter, HTTPException, Query

from models.file_metadata import LLMParseRequest, LLMParseResponse, FileStatus
from services.db.file_ops import file_ops
from services.files.extractor import extractor
from services.llm.gemini import gemini_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/parse", response_model=LLMParseResponse)
async def parse_warranty_data(
    request: LLMParseRequest,
    user_id: str = Query(..., description="User ID")
):
    """
    Parse warranty information from uploaded file using Gemini LLM
    
    - Extracts text from file if not already done
    - Sends text to Gemini for structured warranty data extraction
    - Updates database with parsed warranty information
    - Returns structured warranty data
    """
    try:
        file_id = request.file_id
        logger.info(f"Starting LLM parsing for file: {file_id}")
        
        # Get file metadata
        file_metadata = await file_ops.get_file_by_id(file_id, user_id)
        if not file_metadata:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Check if file is in uploadable state
        if file_metadata.status == FileStatus.PROCESSING:
            raise HTTPException(status_code=409, detail="File is already being processed")
        
        # Update status to processing
        await file_ops.update_file_status(file_id, FileStatus.PROCESSING)
        
        try:
            # Extract text if not already done
            extracted_text = file_metadata.extracted_text
            if not extracted_text:
                logger.info(f"Extracting text from file: {file_id}")
                extracted_text = await extractor.extract_text_from_file(file_metadata.file_path)
                
                if not extracted_text:
                    await file_ops.update_file_status(file_id, FileStatus.FAILED, "Failed to extract text from file")
                    raise HTTPException(status_code=422, detail="Could not extract text from file")
                
                # Save extracted text
                await file_ops.update_extracted_text(file_id, extracted_text)
            
            # Parse warranty data using Gemini
            logger.info(f"Parsing warranty data with Gemini for file: {file_id}")
            warranty_data = await gemini_service.extract_warranty_data(extracted_text)
            
            if not warranty_data:
                await file_ops.update_file_status(file_id, FileStatus.FAILED, "Failed to extract warranty information")
                raise HTTPException(status_code=422, detail="Could not extract warranty information from text")
            
            # Enhance warranty data
            warranty_data = await gemini_service.enhance_warranty_data(warranty_data, extracted_text)
            
            # Validate extraction quality
            quality_info = await gemini_service.validate_extraction_quality(warranty_data)
            logger.info(f"Warranty extraction quality: {quality_info['quality_score']:.1f}% for file: {file_id}")
            
            # Update database with warranty data
            success = await file_ops.update_warranty_data(file_id, warranty_data)
            
            if not success:
                await file_ops.update_file_status(file_id, FileStatus.FAILED, "Failed to save warranty data")
                raise HTTPException(status_code=500, detail="Failed to save warranty data")
            
            # Get updated file metadata
            updated_file = await file_ops.get_file_by_id(file_id, user_id)
            
            logger.info(f"Successfully parsed warranty data for file: {file_id}")
            
            return LLMParseResponse(
                file_id=file_id,
                warranty_data=warranty_data,
                status=FileStatus.PROCESSED,
                processed_at=updated_file.processed_at,
                extraction_quality=quality_info
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"LLM parsing failed for file {file_id}: {e}")
            await file_ops.update_file_status(file_id, FileStatus.FAILED, str(e))
            raise HTTPException(status_code=500, detail=f"LLM parsing failed: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during LLM parsing: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

