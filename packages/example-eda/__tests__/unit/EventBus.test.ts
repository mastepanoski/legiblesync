import { EventBus, Event } from '../../src/core/EventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('Event Subscription', () => {
    it('should subscribe to events', () => {
      const handler = jest.fn();
      eventBus.subscribe('user.created', handler);

      // Should not throw, subscription is successful
      expect(() => eventBus.subscribe('user.created', handler)).not.toThrow();
    });

    it('should handle multiple handlers for the same event', async () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      eventBus.subscribe('order.placed', handler1);
      eventBus.subscribe('order.placed', handler2);

      const eventData = {
        type: 'order.placed' as const,
        payload: { orderId: '123' },
        source: 'orders',
        flowId: 'flow1'
      };

      await eventBus.publish(eventData);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      const calledEvent1 = handler1.mock.calls[0][0];
      const calledEvent2 = handler2.mock.calls[0][0];

      expect(calledEvent1.type).toBe('order.placed');
      expect(calledEvent1.payload).toEqual({ orderId: '123' });
      expect(calledEvent1.source).toBe('orders');
      expect(calledEvent1.flowId).toBe('flow1');
      expect(calledEvent1.timestamp).toBeInstanceOf(Date);

      expect(calledEvent2.type).toBe('order.placed');
      expect(calledEvent2.payload).toEqual({ orderId: '123' });
      expect(calledEvent2.source).toBe('orders');
      expect(calledEvent2.flowId).toBe('flow1');
      expect(calledEvent2.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Event Publishing', () => {
    it('should publish events to subscribed handlers', async () => {
      const handler = jest.fn();
      eventBus.subscribe('product.updated', handler);

      const eventData = {
        type: 'product.updated' as const,
        payload: { productId: '456', changes: { price: 29.99 } },
        source: 'products',
        flowId: 'flow2'
      };

      await eventBus.publish(eventData);

      expect(handler).toHaveBeenCalledTimes(1);
      const calledEvent = handler.mock.calls[0][0];
      expect(calledEvent.type).toBe('product.updated');
      expect(calledEvent.payload).toEqual(eventData.payload);
      expect(calledEvent.source).toBe('products');
      expect(calledEvent.flowId).toBe('flow2');
      expect(calledEvent.timestamp).toBeInstanceOf(Date);
    });

    it('should handle events with no subscribers', async () => {
      const eventData = {
        type: 'unknown.event' as const,
        payload: { data: 'test' },
        source: 'test',
        flowId: 'flow3'
      };

      // Should not throw when publishing to non-existent subscribers
      await expect(eventBus.publish(eventData)).resolves.not.toThrow();
    });

    it('should handle handler errors gracefully', async () => {
      const goodHandler = jest.fn();
      const badHandler = jest.fn().mockRejectedValue(new Error('Handler failed'));

      eventBus.subscribe('test.event', goodHandler);
      eventBus.subscribe('test.event', badHandler);

      const eventData = {
        type: 'test.event' as const,
        payload: { test: true },
        source: 'test',
        flowId: 'flow4'
      };

      // Should not throw even if one handler fails
      await expect(eventBus.publish(eventData)).resolves.not.toThrow();

      // Good handler should still be called
      expect(goodHandler).toHaveBeenCalledTimes(1);
      expect(badHandler).toHaveBeenCalledTimes(1);
    });

    it('should call handlers asynchronously', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      eventBus.subscribe('async.event', handler);

      const eventData = {
        type: 'async.event' as const,
        payload: { async: true },
        source: 'async',
        flowId: 'flow5'
      };

      const publishPromise = eventBus.publish(eventData);

      // Should return a promise
      expect(publishPromise).toBeInstanceOf(Promise);

      await publishPromise;

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Creation Helper', () => {
    it('should create events from engine actions', () => {
      const event = eventBus.createEventFromAction(
        'User',
        'register',
        { username: 'testuser' },
        { userId: '123', user: { id: '123' } },
        'flow6'
      );

      expect(event.type).toBe('User.register');
      expect(event.payload).toEqual({
        input: { username: 'testuser' },
        output: { userId: '123', user: { id: '123' } }
      });
      expect(event.source).toBe('User');
      expect(event.flowId).toBe('flow6');
      expect(event.timestamp).toBeInstanceOf(Date);
    });
  });
});