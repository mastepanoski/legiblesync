// core/EventBus.ts

export interface Event {
  type: string;
  payload: Record<string, any>;
  source: string;
  timestamp: Date;
  flowId: string;
}

export type EventHandler = (event: Event) => Promise<void>;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  constructor() {
    // EventBus is independent of the LegibleEngine
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
        // Handler errors are silently ignored to prevent cascading failures
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