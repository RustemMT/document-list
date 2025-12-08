export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Document {
  id: number;
  file_name: string;
  version: string;
  size: number;
  upload_date: string;
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
}
