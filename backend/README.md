

# aegys Backend

**aegys** is a backend API for a Warranty & Bill Organizer, designed to help users manage device warranties, bills, and service records. It enables uploading and parsing of warranty documents, tracking device coverage, setting alerts for expirations, and more.


## Project Overview

**Domain:** Personal finance, device ownership  
**Pain Point:** Users often misplace warranty details and miss coverage or repair windows.  
**Solution:** aegys provides a centralized platform to upload, extract, and track warranty and bill information, set reminders, and manage device service history.



## Tech Stack

- **Backend Framework:** FastAPI (Python)
- **Database:** MongoDB (async, via pymongo)
- **File Storage:** Local, with optional S3/aiofiles support
- **PDF/Text Extraction:** Custom extractors, GenAI 
- **Frontend :** React, Tailwind CSS, PDF viewer
- **Other:** Pydantic (data validation), Logging, CORS, Email reminders (planned)

## API Endpoints

### 1. **File Upload & Validation**

#### `POST /upload/`
- **Purpose:** Upload a warranty/bill file, extract text, and create a database record.
- **Request:** `multipart/form-data`
  - `file`: The file to upload (PDF, image, etc.)
  - `user_id`: User identifier
- **Response:** `FileUploadResponse`
  ```json
  {
    "file_id": "string",
    "original_filename": "string",
    "file_size": 12345,
    "status": "text_extracted | failed | uploaded | processing | processed | deleted",
    "uploaded_at": "2025-07-05T17:32:00Z"
  }
  ```
- **Errors:** 400 (invalid file), 500 (server error)

#### `POST /upload/validate`
- **Purpose:** Validate file type and size before upload.
- **Request:** `multipart/form-data`
  - `file`: The file to validate
- **Response:** JSON with validation result
  ```json
  {
    "valid": true,
    "file_size": 12345,
    "file_type": "pdf",
    "message": "File validation passed"
  }
  ```

---

### 2. **File Management**

#### `GET /files/`
- **Purpose:** List files for a user, with pagination and optional status filter.
- **Query Params:**
  - `user_id` (required)
  - `page` (default: 1)
  - `page_size` (default: 20)
  - `status` (optional: filter by file status)
- **Response:** `FileListResponse`
  ```json
  {
    "files": [FileMetadata, ...],
    "total": 42,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
  }
  ```
  - `FileMetadata` includes all file details, warranty data, expiry info, etc.

#### `GET /files/{file_id}`
- **Purpose:** Get detailed metadata for a specific file.
- **Query Params:** `user_id`
- **Response:** `FileMetadata`

#### `DELETE /files/{file_id}`
- **Purpose:** Delete a file and its database record.
- **Query Params:** `user_id`
- **Response:** JSON with deletion status

#### `GET /files/user/{user_id}/stats`
- **Purpose:** Get file statistics for a user (counts, storage usage, expiring warranties).
- **Response:** JSON with stats

#### `GET /files/user/{user_id}/expiring`
- **Purpose:** List files with warranties expiring soon.
- **Query Params:** `days_ahead` (default: 30)
- **Response:** JSON with expiring files

#### `POST /files/user/{user_id}/cleanup`
- **Purpose:** Clean up expired files for a user (dry run or actual delete).
- **Query Params:** `dry_run` (default: false)
- **Response:** JSON with cleanup summary

---

### 3. **LLM Parsing**

#### `POST /llm/parse`
- **Purpose:** Use GenAI (e.g., Gemini) to extract structured warranty data from file text.
- **Request:** `LLMParseRequest` (JSON)
  ```json
  {
    "file_id": "string"
  }
  ```
- **Query Params:** `user_id`
- **Response:** `LLMParseResponse`
  ```json
  {
    "file_id": "string",
    "warranty_data": { ... },
    "status": "processed",
    "processed_at": "2025-07-05T18:00:00Z"
  }
  ```

---

### 4. **Alerts & Cleanup (Admin/System)**

#### `POST /cleanup/schedule`
- **Purpose:** Schedule cleanup of expired files (admin/cron).
- **Request:** `CleanupScheduleRequest`
- **Response:** `CleanupResponse`

#### `GET /cleanup/alerts`
- **Purpose:** Get warranty expiry alerts for a user.
- **Header:** `user_id`
- **Response:** `AlertsResponse` (categorized by severity)

#### `GET /cleanup/alerts/expiring`
- **Purpose:** Get a flat list of expiring warranties.
- **Header:** `user_id`
- **Query Params:** `days_ahead`
- **Response:** List of `AlertItem`

#### `GET /cleanup/alerts/severity`
- **Purpose:** Get alerts grouped by severity.
- **Header:** `user_id`
- **Response:** Dict of severity → list of `AlertItem`

#### `POST /cleanup/background/start`
- **Purpose:** Start background cleanup task (system use).
- **Query Params:** `interval_hours`
- **Response:** JSON with task info

#### `POST /cleanup/background/stop`
- **Purpose:** Stop all background cleanup tasks.
- **Response:** JSON with status



## Data Models (Schemas)

### FileMetadata
- All file details, including:
  - `id`, `user_id`, `original_filename`, `file_path`, `file_type`, `file_size`, `mime_type`
  - `status`, `uploaded_at`, `processed_at`
  - `extracted_text`, `warranty_data`
  - `expires_at`, `expiry_warning`
  - `error_message`, `processing_attempts`

### WarrantyData
- Structured warranty info: device, brand, model, purchase/warranty dates, coverage, exclusions, etc.

### FileUploadResponse, FileListResponse, LLMParseResponse, AlertsResponse, CleanupResponse
- See endpoint responses above for fields.


## Example Usage

1. **Upload a bill/warranty:**  
   `POST /upload/` with file and user_id  
   → Returns file_id and status

2. **Parse warranty data:**  
   `POST /llm/parse` with file_id and user_id  
   → Returns structured warranty info

3. **Get alerts:**  
   `GET /cleanup/alerts` with user_id header  
   → Returns categorized expiry alerts

4. **Clean up expired files:**  
   `POST /files/user/{user_id}/cleanup`  
   → Returns summary of deleted/expired files



## Extensibility

- **Cloud Storage:** Easily swap local storage for S3/aiofiles.
- **Email Reminders:** Integrate with SMTP or third-party services.
- **GenAI:** Plug in any LLM for warranty parsing.
- **Frontend:** Connect with React/Tailwind for a modern UI.



## Contributing

1. Fork and clone the repo
2. Set up MongoDB and environment variables (see `config.py`)
3. Run with `uvicorn backend.main:app --reload`
4. Use the OpenAPI docs at `/docs` for testing



## License

MIT License

---

**For more details, see the code and docstrings in each route and model.**