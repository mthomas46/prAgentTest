import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../shared/logger/logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info messages', () => {
    const spy = jest.spyOn(console, 'info');
    service.log('Test info message');
    expect(spy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    const spy = jest.spyOn(console, 'error');
    service.error('Test error message', 'Error: Test error');
    expect(spy).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    const spy = jest.spyOn(console, 'warn');
    service.warn('Test warning message');
    expect(spy).toHaveBeenCalled();
  });

  it('should log debug messages', () => {
    const spy = jest.spyOn(console, 'debug');
    service.debug('Test debug message');
    expect(spy).toHaveBeenCalled();
  });

  it('should log verbose messages', () => {
    const spy = jest.spyOn(console, 'debug');
    service.verbose('Test verbose message');
    expect(spy).toHaveBeenCalled();
  });

  it('should include context in log messages', () => {
    const spy = jest.spyOn(console, 'info');
    service.log('Test message with context', 'TestContext');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.any(String)
    );
  });
}); 