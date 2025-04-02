export interface DocumentData {
  documentId: string;
  type: string;
  status: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface WebhookEvent {
  event: 'document.created' | 'document.updated' | 'document.deleted';
  timestamp: string;
  data: DocumentData;
  metadata?: {
    source?: string;
    correlationId?: string;
    [key: string]: any;
  };
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  timestamp: string;
  correlationId?: string;
  data?: {
    documentId?: string;
    status?: string;
    [key: string]: any;
  };
} 