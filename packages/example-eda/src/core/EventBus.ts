// core/EventBus.ts
import { LegibleEngine } from '@legible-sync/core';

export interface Event {
  type: string;
  payload: Record<string, any>;
  source: string;
  timestamp: Date;
  flowId: string;
}

export type EventHandler = (event: Event) => Promise<void>;

export class EventBus {
  private engine: LegibleEngine;
  private handlers: Map<string, EventHandler[]> = new Map();

  constructor(engine: LegibleEngine) {
    this.engine = engine;
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish(event: Omit<Event, 'timestamp'>): Promise<void> {
    const fullEvent: Event = {
      ...event,
      timestamp: new Date()
    };

    console.log(`📢 Event: ${fullEvent.type} from ${fullEvent.source}`, fullEvent.payload);

    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      try {
        await handler(fullEvent);
      } catch (error) {
        console.error(`❌ Error handling event ${event.type}:`, error);
      }
    }
  }

  // Helper to create events from engine actions
  createEventFromAction(concept: string, action: string, input: any, output: any, flowId: string): Event {
    return {
      type: `${concept}.${action}`,
      payload: { input, output },
      source: concept,
      timestamp: new Date(),
      flowId
    };
  }
}