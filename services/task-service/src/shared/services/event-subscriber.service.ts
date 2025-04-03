import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventSubscriberService implements OnModuleInit {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    // Register event listeners here
  }

  async subscribe(eventName: string, listener: (data: any) => void | Promise<void>): Promise<void> {
    this.eventEmitter.on(eventName, listener);
  }

  async subscribeOnce(eventName: string, listener: (data: any) => void | Promise<void>): Promise<void> {
    this.eventEmitter.once(eventName, listener);
  }
} 