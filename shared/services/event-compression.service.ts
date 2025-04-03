import { Injectable, Logger } from '@nestjs/common';
import { IEvent } from '../interfaces/events.interface';
import * as zlib from 'zlib';
import { promisify } from 'util';

const compress = promisify(zlib.gzip);
const decompress = promisify(zlib.gunzip);

@Injectable()
export class EventCompressionService {
  private readonly logger = new Logger(EventCompressionService.name);
  private readonly COMPRESSION_THRESHOLD = 1024 * 10; // 10KB

  async compressEvent(event: IEvent): Promise<IEvent> {
    const eventSize = JSON.stringify(event.data).length;
    
    if (eventSize <= this.COMPRESSION_THRESHOLD) {
      return event;
    }

    try {
      const compressedData = await compress(JSON.stringify(event.data));
      return {
        ...event,
        data: compressedData,
        metadata: {
          ...event.metadata,
          compressed: true,
          originalSize: eventSize,
        },
      };
    } catch (error) {
      this.logger.error('Failed to compress event data', error.stack);
      return event;
    }
  }

  async decompressEvent(event: IEvent): Promise<IEvent> {
    if (!event.metadata?.compressed) {
      return event;
    }

    try {
      const decompressedData = await decompress(event.data as Buffer);
      return {
        ...event,
        data: JSON.parse(decompressedData.toString()),
        metadata: {
          ...event.metadata,
          compressed: false,
        },
      };
    } catch (error) {
      this.logger.error('Failed to decompress event data', error.stack);
      throw error;
    }
  }
} 