import { Request, Response } from 'express';
import { ErrorCallback } from 'http-proxy';

export interface ServiceConfig {
  name: string;
  target: string;
  path: string;
}

export interface ProxyError {
  code: string;
  message: string;
}

export type HealthCheckHandler = (req: Request, res: Response) => void;

export type ErrorHandler = ErrorCallback;

export type ProxyRequestHandler = (proxyReq: any, req: Request, res: Response) => void; 