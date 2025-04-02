import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../src/common/services/logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info messages', () => {
    expect(() => service.log('Test info message')).not.toThrow();
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    expect(() => service.error('Test error message', error.stack)).not.toThrow();
  });

  it('should log warning messages', () => {
    expect(() => service.warn('Test warning message')).not.toThrow();
  });

  it('should log debug messages', () => {
    expect(() => service.debug('Test debug message')).not.toThrow();
  });

  it('should log verbose messages', () => {
    expect(() => service.verbose('Test verbose message')).not.toThrow();
  });

  it('should include context in log messages', () => {
    expect(() => service.log('Test message with context', 'TestContext')).not.toThrow();
  });
}); 