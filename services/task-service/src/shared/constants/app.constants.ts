export const CORS_OPTIONS = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
}; 