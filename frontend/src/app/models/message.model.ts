export interface Message {
  _id: string;
  phone_number: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: { field: string; message: string }[];
  };
}
