import logging
import asyncio
import fitz 
import pytesseract
from PIL import Image
from config import settings
from models.file_metadata import FileType

logger = logging.getLogger(__name__)

class TextExtractor:
    def __init__(self):
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    async def extract_text_from_file(self, file_path: str, file_type: FileType) -> str:
        """Extract text from PDF or image file"""
        try:
            if file_type == FileType.PDF:
                return await self._extract_from_pdf(file_path)
            elif file_type == FileType.IMAGE:
                return await self._extract_from_image(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            logger.error(f"Text extraction failed for {file_path}: {e}")
            raise

    async def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using PyMuPDF"""
        def _sync_extract_pdf():
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text.strip()

        # Run in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        text = await loop.run_in_executor(None, _sync_extract_pdf)
        
        # If PDF text extraction yields little content, try OCR
        if len(text) < 50:
            logger.info(f"PDF text extraction yielded minimal content, attempting OCR for {file_path}")
            text = await self._extract_pdf_with_ocr(file_path)
        
        return text

    async def _extract_pdf_with_ocr(self, file_path: str) -> str:
        """Extract text from PDF using OCR (for scanned PDFs)"""
        def _sync_pdf_ocr():
            doc = fitz.open(file_path)
            text = ""
            for page_num in range(len(doc)):
                page = doc[page_num]
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))
                page_text = pytesseract.image_to_string(image, lang=settings.TESSERACT_LANG)
                text += page_text + "\n"
            doc.close()
            return text.strip()

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_pdf_ocr)

    async def _extract_from_image(self, file_path: str) -> str:
        """Extract text from image using Tesseract OCR"""
        def _sync_extract_image():
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image, lang=settings.TESSERACT_LANG)
            return text.strip()

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_extract_image)

    async def validate_file_content(self, file_path: str, file_type: FileType) -> bool:
        """Validate that file can be processed"""
        try:
            if file_type == FileType.PDF:
                return await self._validate_pdf(file_path)
            elif file_type == FileType.IMAGE:
                return await self._validate_image(file_path)
            return False
        except Exception as e:
            logger.error(f"File validation failed for {file_path}: {e}")
            return False

    async def _validate_pdf(self, file_path: str) -> bool:
        """Validate PDF file"""
        def _sync_validate():
            try:
                doc = fitz.open(file_path)
                valid = len(doc) > 0
                doc.close()
                return valid
            except:
                return False

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_validate)

    async def _validate_image(self, file_path: str) -> bool:
        """Validate image file"""
        def _sync_validate():
            try:
                with Image.open(file_path) as img:
                    img.verify()
                return True
            except:
                return False

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_validate)

# Global extractor instance
extractor = TextExtractor()