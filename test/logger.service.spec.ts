import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../shared/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

// Mock winston
jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
    json: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
  };
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});

// Mock the winston-elasticsearch module
jest.mock('winston-elasticsearch', () => ({
  ElasticsearchTransport: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
  })),
}));

type LoggerConfig = {
  LOG_LEVEL: string;
  NODE_ENV: string;
  LOG_FORMAT: string;
  LOG_OUTPUT: string;
  ELASTICSEARCH_URL?: string;
};

describe('LoggerService', () => {
  let service: LoggerService;
  let configService: ConfigService;
  let logger: any;

  const mockConfig: LoggerConfig = {
    LOG_LEVEL: 'debug',
    NODE_ENV: 'test',
    LOG_FORMAT: 'json',
    LOG_OUTPUT: 'console',
    ELASTICSEARCH_URL: undefined
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: keyof LoggerConfig) => mockConfig[key])
          }
        }
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    configService = module.get<ConfigService>(ConfigService);
    logger = (winston.createLogger as jest.Mock)();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logging methods', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should log messages with context', () => {
      const message = 'Test message';
      const context = 'TestContext';

      service.log(message, context);
      expect(logger.info).toHaveBeenCalledWith(message, { context });
    });

    it('should log error messages', () => {
      const message = 'Error message';
      const context = 'ErrorContext';
      const trace = 'Error trace';

      service.error(message, trace, context);
      expect(logger.error).toHaveBeenCalledWith(message, { trace, context });
    });

    it('should log warning messages', () => {
      const message = 'Warning message';
      const context = 'WarnContext';

      service.warn(message, context);
      expect(logger.warn).toHaveBeenCalledWith(message, { context });
    });

    it('should log debug messages', () => {
      const message = 'Debug message';
      const context = 'DebugContext';

      service.debug(message, context);
      expect(logger.debug).toHaveBeenCalledWith(message, { context });
    });

    it('should handle undefined context', () => {
      const message = 'Test message';

      service.log(message);
      expect(logger.info).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should handle circular references in message', () => {
      const circular: any = { prop: 'value' };
      circular.self = circular;

      // Use a custom replacer function to handle circular references
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular]";
            }
            seen.add(value);
          }
          return value;
        };
      };

      const message = JSON.stringify(circular, getCircularReplacer());
      service.log(message);
      expect(logger.info).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should handle undefined message', () => {
      service.log('undefined');
      expect(logger.info).toHaveBeenCalledWith('undefined', { context: undefined });
    });
  });
}); 