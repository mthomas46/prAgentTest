import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../shared/logger/logger.service';
import { ConfigService } from '@nestjs/config';

describe('LoggerService', () => {
  let service: LoggerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'LOG_LEVEL':
            return 'debug';
          default:
            return null;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info messages', () => {
    const logSpy = jest.spyOn(service, 'log');
    service.log('Test info message');
    expect(logSpy).toHaveBeenCalledWith('Test info message');
  });

  it('should log error messages', () => {
    const errorSpy = jest.spyOn(service, 'error');
    const error = new Error('Test error');
    service.error('Test error message', error.stack);
    expect(errorSpy).toHaveBeenCalledWith('Test error message', error.stack);
  });

  it('should log warning messages', () => {
    const warnSpy = jest.spyOn(service, 'warn');
    service.warn('Test warning message');
    expect(warnSpy).toHaveBeenCalledWith('Test warning message');
  });

  it('should log debug messages', () => {
    const debugSpy = jest.spyOn(service, 'debug');
    service.debug('Test debug message');
    expect(debugSpy).toHaveBeenCalledWith('Test debug message');
  });

  it('should log verbose messages', () => {
    const verboseSpy = jest.spyOn(service, 'verbose');
    service.verbose('Test verbose message');
    expect(verboseSpy).toHaveBeenCalledWith('Test verbose message');
  });

  it('should include context in log messages', () => {
    const logSpy = jest.spyOn(service, 'log');
    service.log('Test message with context', 'TestContext');
    expect(logSpy).toHaveBeenCalledWith('Test message with context', 'TestContext');
  });
}); 