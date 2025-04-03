jest.setTimeout(30000);

process.env.NODE_ENV = 'test';
process.env.ELASTICSEARCH_NODE = 'http://localhost:9200';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/test_db'; 