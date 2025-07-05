import logging
import asyncio
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
from config import settings
from models.file_metadata import WarrantyData
from utils.datetime import parse_flexible_date

logger = logging.getLogger(__name__)

class GeminiPromptBuilder:
    """Builds structured prompts for Gemini warranty data extraction"""
    
    @staticmethod
    def build_warranty_extraction_prompt(text: str) -> str:
        """Build prompt for extracting warranty information from text"""
        return f"""
You are an expert at extracting warranty information from documents. Analyze the following text and extract warranty-related information in a structured format.

Text to analyze:
{text}

Extract the following information if available:
- Device/Product name
- Brand/Manufacturer
- Model number
- Purchase date
- Warranty start date
- Warranty end date
- Warranty period/duration
- Coverage details
- Exclusions
- Contact information
- Any additional warranty information

Return the information in this exact JSON format:
{{
    "device_name": "string or null",
    "brand": "string or null", 
    "model": "string or null",
    "purchase_date": "DD/MM/YYYY or null",
    "warranty_start": "DD/MM/YYYY or null",
    "warranty_end": "DD/MM/YYYY or null",
    "warranty_period": "string or null",
    "coverage_details": "string or null",
    "exclusions": "string or null",
    "contact_info": "string or null",
    "additional_info": {{
        "key": "value pairs for any other relevant warranty information"
    }}
}}

Important notes:
- Use DD/MM/YYYY format for all dates
- If information is not found, use null
- Be precise and extract only information that is clearly stated
- For warranty_period, use natural language like "2 years", "12 months", etc.
- Include serial numbers, invoice numbers, etc. in additional_info if found
- Only return the JSON object, no additional text
"""

class GeminiService:
    """Service for integrating with Google Gemini API for warranty data extraction"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.temperature = settings.GEMINI_TEMPERATURE
        self.max_tokens = settings.GEMINI_MAX_TOKENS
        self.client = None
        self._configure_client()
    
    def _configure_client(self):
        """Configure Google Generative AI client"""
        try:
            self.client = genai.Client(api_key=self.api_key)
            logger.info(f"Gemini client configured with model: {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to configure Gemini client: {e}")
            raise
    
    async def extract_warranty_data(self, text: str, max_retries: int = 3) -> Optional[WarrantyData]:
        """Extract warranty information from text using Gemini API"""
        if not text or not text.strip():
            logger.warning("Empty text provided for warranty extraction")
            return None
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Attempting warranty extraction (attempt {attempt + 1}/{max_retries})")
                
                # Build prompt
                prompt = GeminiPromptBuilder.build_warranty_extraction_prompt(text)
                
                # Call Gemini API
                response = await self._call_gemini_async(prompt)
                
                if not response:
                    logger.warning(f"Empty response from Gemini (attempt {attempt + 1})")
                    continue
                
                # Parse response
                warranty_data = self._parse_warranty_response(response)
                
                if warranty_data:
                    logger.info("Successfully extracted warranty data")
                    return warranty_data
                else:
                    logger.warning(f"Failed to parse warranty response (attempt {attempt + 1})")
                    
            except Exception as e:
                logger.error(f"Warranty extraction failed (attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    raise
                
                # Wait before retry
                await asyncio.sleep(1 * (attempt + 1))
        
        logger.error("All warranty extraction attempts failed")
        return None
    
    async def _call_gemini_async(self, prompt: str) -> Optional[str]:
        """Make async call to Gemini API"""
        try:
            # Create generation config
            config = types.GenerateContentConfig(
                temperature=self.temperature,
                max_output_tokens=self.max_tokens,
                response_mime_type='application/json'
            )
            
            # Make async API call
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=[prompt], 
                config=config
            )
            
            return response.text if response.text else None
            
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            raise
    
    def _parse_warranty_response(self, response_text: str) -> Optional[WarrantyData]:
        """Parse Gemini response and create WarrantyData object"""
        try:
            import json
            
            # Clean response text
            response_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON
            data = json.loads(response_text)
            
            # Convert date strings to datetime objects
            warranty_data = {}
            
            # Handle string fields
            string_fields = ['device_name', 'brand', 'model', 'warranty_period', 
                           'coverage_details', 'exclusions', 'contact_info']
            
            for field in string_fields:
                value = data.get(field)
                warranty_data[field] = value if value and value.lower() != 'null' else None
            
            # Handle date fields
            date_fields = ['purchase_date', 'warranty_start', 'warranty_end']
            
            for field in date_fields:
                date_str = data.get(field)
                if date_str and date_str.lower() != 'null':
                    parsed_date = parse_flexible_date(date_str)
                    warranty_data[field] = parsed_date
                else:
                    warranty_data[field] = None
            
            # Handle additional_info
            additional_info = data.get('additional_info')
            if additional_info and isinstance(additional_info, dict):
                # Filter out null values
                warranty_data['additional_info'] = {
                    k: v for k, v in additional_info.items() 
                    if v is not None and str(v).lower() != 'null'
                }
            else:
                warranty_data['additional_info'] = None
            
            return WarrantyData(**warranty_data)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {e}")
            logger.error(f"Response text: {response_text}")
            return None
        except Exception as e:
            logger.error(f"Warranty data parsing failed: {e}")
            return None
    
    async def validate_extraction_quality(self, warranty_data: WarrantyData) -> Dict[str, Any]:
        """Validate quality of extracted warranty data"""
        quality_score = 0
        total_fields = 0
        issues = []
        
        # Check required fields
        required_fields = ['device_name', 'brand', 'warranty_end']
        for field in required_fields:
            total_fields += 1
            if getattr(warranty_data, field):
                quality_score += 1
            else:
                issues.append(f"Missing {field}")
        
        # Check optional but important fields
        optional_fields = ['model', 'purchase_date', 'warranty_start', 'warranty_period']
        for field in optional_fields:
            total_fields += 1
            if getattr(warranty_data, field):
                quality_score += 0.5
        
        # Check date consistency
        if warranty_data.warranty_start and warranty_data.warranty_end:
            if warranty_data.warranty_start > warranty_data.warranty_end:
                issues.append("Warranty start date is after end date")
        
        if warranty_data.purchase_date and warranty_data.warranty_start:
            if warranty_data.purchase_date > warranty_data.warranty_start:
                issues.append("Purchase date is after warranty start")
        
        quality_percentage = (quality_score / total_fields) * 100 if total_fields > 0 else 0
        
        return {
            'quality_score': quality_percentage,
            'issues': issues,
            'has_critical_info': bool(warranty_data.device_name and warranty_data.warranty_end),
            'extracted_fields': sum(1 for field in ['device_name', 'brand', 'model', 'purchase_date', 
                                                  'warranty_start', 'warranty_end', 'warranty_period',
                                                  'coverage_details', 'exclusions', 'contact_info']
                                  if getattr(warranty_data, field))
        }
    
    async def enhance_warranty_data(self, warranty_data: WarrantyData, original_text: str) -> WarrantyData:
        """Enhance warranty data with additional processing"""
        try:
            # Calculate missing dates if possible
            if warranty_data.purchase_date and warranty_data.warranty_period and not warranty_data.warranty_end:
                warranty_data = self._calculate_warranty_end_date(warranty_data)
            
            # Set warranty start to purchase date if not present
            if warranty_data.purchase_date and not warranty_data.warranty_start:
                warranty_data.warranty_start = warranty_data.purchase_date
            
            # Clean up text fields
            warranty_data = self._clean_text_fields(warranty_data)
            
            return warranty_data
            
        except Exception as e:
            logger.error(f"Warranty data enhancement failed: {e}")
            return warranty_data
    
    def _calculate_warranty_end_date(self, warranty_data: WarrantyData) -> WarrantyData:
        """Calculate warranty end date from purchase date and period"""
        try:
            if not warranty_data.purchase_date or not warranty_data.warranty_period:
                return warranty_data
            
            period_text = warranty_data.warranty_period.lower()
            
            # Extract years
            if 'year' in period_text:
                import re
                years_match = re.search(r'(\d+)\s*year', period_text)
                if years_match:
                    years = int(years_match.group(1))
                    from utils.datetime import add_days_to_date
                    warranty_data.warranty_end = add_days_to_date(warranty_data.purchase_date, years * 365)
            
            # Extract months
            elif 'month' in period_text:
                import re
                months_match = re.search(r'(\d+)\s*month', period_text)
                if months_match:
                    months = int(months_match.group(1))
                    from utils.datetime import add_days_to_date
                    warranty_data.warranty_end = add_days_to_date(warranty_data.purchase_date, months * 30)
            
            return warranty_data
            
        except Exception as e:
            logger.error(f"Warranty end date calculation failed: {e}")
            return warranty_data
    
    def _clean_text_fields(self, warranty_data: WarrantyData) -> WarrantyData:
        """Clean up text fields in warranty data"""
        try:
            # Clean device name
            if warranty_data.device_name:
                warranty_data.device_name = warranty_data.device_name.strip()
            
            # Clean brand
            if warranty_data.brand:
                warranty_data.brand = warranty_data.brand.strip().title()
            
            # Clean model
            if warranty_data.model:
                warranty_data.model = warranty_data.model.strip()
            
            # Clean coverage details
            if warranty_data.coverage_details:
                warranty_data.coverage_details = warranty_data.coverage_details.strip()
            
            # Clean exclusions
            if warranty_data.exclusions:
                warranty_data.exclusions = warranty_data.exclusions.strip()
            
            # Clean contact info
            if warranty_data.contact_info:
                warranty_data.contact_info = warranty_data.contact_info.strip()
            
            return warranty_data
            
        except Exception as e:
            logger.error(f"Text field cleaning failed: {e}")
            return warranty_data

# Global Gemini service instance
gemini_service = GeminiService()