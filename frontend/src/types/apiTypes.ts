export type FileStatus = "" | "uploaded" | "processing" | "processed" | "failed" | "deleted";
export type FileType = "pdf" | "image";

export interface WarrantyData {
  device_name?: string;
  brand?: string;
  model?: string;
  purchase_date?: string; // ISO string
  warranty_start?: string;
  warranty_end?: string;
  warranty_period?: string;
  coverage_details?: string;
  exclusions?: string;
  contact_info?: string;
  additional_info?: Record<string, any>;
}

export interface FileMetadata {
  _id: string;
  user_id: string;
  original_filename: string;
  file_path: string;
  file_type: FileType;
  file_size: number;
  mime_type: string;
  status: FileStatus;
  uploaded_at: string;
  processed_at?: string;
  extracted_text?: string;
  warranty_data?: WarrantyData;
  expires_at?: string;
  expiry_warning?: string;
  error_message?: string;
  processing_attempts: number;
}

export interface FileUploadResponse {
  file_id: string;
  original_filename: string;
  file_size: number;
  status: FileStatus;
  uploaded_at: string;
}

export interface FileListResponse {
  files: FileMetadata[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FileDetailResponse {
  file: FileMetadata;
}

export interface FileStatsResponse {
  total_files: number;
  storage_usage: number;
  files_by_status: Record<FileStatus, number>;
  expiring_warranties: number;
  processed_files: number;
  failed_files: number;
}

export interface ExpiringFileResponse {
  expiring_files: FileMetadata[];
  count: number;
  days_ahead: number;
}

export interface LLMParseResponse {
  file_id: string;
  warranty_data?: WarrantyData;
  status: FileStatus;
  processed_at: string;
  extraction_quality?: any;
}

export interface AlertItem {
  file_id: string;
  device_name?: string;
  warranty_end?: string;
  days_until_expiry: number;
}

export interface AlertsResponse {
  user_id: string;
  total_alerts: number;
  expired_count: number;
  critical_count: number;
  warning_count: number;
  notice_count: number;
  most_urgent_alert?: AlertItem;
  alerts_by_severity: Record<string, AlertItem[]>;
  last_checked: string;
}

export type AlertsBySeverity = Record<string, AlertItem[]>;

export interface CleanupResponse {
  total_files: number;
  expired_files: number;
  files_to_delete: string[];
  dry_run: boolean;
  deleted_from_storage?: number;
  deleted_from_db?: number;
  cleanup_completed?: boolean;
  message?: string;
  error?: string;
}

export interface FileValidationResponse {
  valid: boolean;
  error?: string;
  file_size?: number;
  file_type?: FileType;
  message?: string;
}
