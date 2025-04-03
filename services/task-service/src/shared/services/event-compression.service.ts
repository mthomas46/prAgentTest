import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { IEvent } from '../interfaces/events.interface';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

@Injectable()
export class EventCompressionService {
  async compressEvent(event: IEvent<any>): Promise<{ data: Buffer }> {
    const eventData = JSON.stringify(event.data);
    const compressedData = await gzip(eventData);
    return { data: compressedData };
  }

  async decompressEvent(event: Event): Promise<{ data: any }> {
    if (!event.data) {
      return { data: null };
    }
    const decompressedData = await gunzip(event.data);
    return { data: JSON.parse(decompressedData.toString()) };
  }
} 