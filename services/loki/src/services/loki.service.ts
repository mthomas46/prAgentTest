import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class LokiService {
  private readonly logger = new Logger(LokiService.name);
  private readonly protectedServices = ['heimdal', 'brokkr'];

  async bringDownService(serviceName: string): Promise<{ success: boolean; message: string }> {
    if (this.protectedServices.includes(serviceName.toLowerCase())) {
      return {
        success: false,
        message: `Cannot bring down protected service: ${serviceName}`,
      };
    }

    try {
      this.logger.log(`Attempting to bring down service: ${serviceName}`);
      await execAsync(`docker-compose stop ${serviceName}`);
      return {
        success: true,
        message: `Successfully brought down service: ${serviceName}`,
      };
    } catch (error) {
      this.logger.error(`Failed to bring down service ${serviceName}: ${error.message}`);
      return {
        success: false,
        message: `Failed to bring down service: ${error.message}`,
      };
    }
  }

  async bringUpService(serviceName: string): Promise<{ success: boolean; message: string }> {
    if (this.protectedServices.includes(serviceName.toLowerCase())) {
      return {
        success: false,
        message: `Cannot bring up protected service: ${serviceName}`,
      };
    }

    try {
      this.logger.log(`Attempting to bring up service: ${serviceName}`);
      await execAsync(`docker-compose start ${serviceName}`);
      return {
        success: true,
        message: `Successfully brought up service: ${serviceName}`,
      };
    } catch (error) {
      this.logger.error(`Failed to bring up service ${serviceName}: ${error.message}`);
      return {
        success: false,
        message: `Failed to bring up service: ${error.message}`,
      };
    }
  }

  async getServiceStatus(serviceName: string): Promise<{ status: string; message: string }> {
    try {
      const { stdout } = await execAsync(`docker-compose ps ${serviceName}`);
      const isRunning = stdout.includes('Up');
      return {
        status: isRunning ? 'running' : 'stopped',
        message: `Service ${serviceName} is ${isRunning ? 'running' : 'stopped'}`,
      };
    } catch (error) {
      this.logger.error(`Failed to get status for service ${serviceName}: ${error.message}`);
      return {
        status: 'unknown',
        message: `Failed to get status: ${error.message}`,
      };
    }
  }
} 