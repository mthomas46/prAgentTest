export interface Document {
  id: string;
  title: string;
  content: string;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
} 