import { LegibleEngine } from '../src/engine/Engine';
import { Concept, SyncRule } from '../src/engine/types';
import { QueueFactory } from '../src/queues/QueueFactory';

describe('LegibleEngine', () => {
  let engine: LegibleEngine;

  beforeEach(() => {
    engine = new LegibleEngine();
  });

  describe('Concept Registration and Execution', () => {
    it('should register and execute a concept', async () => {
      const mockConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ result: 'success' })
      };

      engine.registerConcept('testConcept', mockConcept);

      const result = await engine.invoke('testConcept', 'testAction', { input: 'value' }, 'flow1');

      expect(mockConcept.execute).toHaveBeenCalledWith('testAction', { input: 'value' });
      expect(result).toEqual({ result: 'success' });
    });

    it('should throw error for unregistered concept', async () => {
      await expect(engine.invoke('unknownConcept', 'action', {}, 'flow1')).rejects.toThrow('Concept unknownConcept not found');
    });

    it('should handle concept execution errors', async () => {
      const mockConcept: Concept = {
        state: {},
        execute: jest.fn().mockRejectedValue(new Error('Execution failed'))
      };

      engine.registerConcept('failingConcept', mockConcept);

      await expect(engine.invoke('failingConcept', 'failAction', {}, 'flow1')).rejects.toThrow('Execution failed');
    });
  });

  describe('Sync Rules', () => {
    it('should register and trigger sync rules', async () => {
      const triggerConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ triggered: true })
      };

      const syncConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ synced: true })
      };

      engine.registerConcept('trigger', triggerConcept);
      engine.registerConcept('sync', syncConcept);

      const syncRule: SyncRule = {
        name: 'testSync',
        when: [{
          concept: 'trigger',
          action: 'triggerAction',
          input: { type: 'test' }
        }],
        then: [{
          concept: 'sync',
          action: 'syncAction',
          input: { message: 'synced' }
        }]
      };

      engine.registerSync(syncRule);

      await engine.invoke('trigger', 'triggerAction', { type: 'test' }, 'flow1');

      expect(syncConcept.execute).toHaveBeenCalledWith('syncAction', { message: 'synced' });
    });

    it('should extract variables from action input/output', async () => {
      const triggerConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ userId: 123, status: 'active' })
      };

      const syncConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ processed: true })
      };

      engine.registerConcept('user', triggerConcept);
      engine.registerConcept('processor', syncConcept);

      const syncRule: SyncRule = {
        name: 'userSync',
        when: [{
          concept: 'user',
          action: 'create',
          output: { status: 'active' }
        }],
        then: [{
          concept: 'processor',
          action: 'process',
          input: { id: '?userId', action: 'create' }
        }]
      };

      engine.registerSync(syncRule);

      await engine.invoke('user', 'create', { name: 'John' }, 'flow1');

      expect(syncConcept.execute).toHaveBeenCalledWith('process', { id: 123, action: 'create' });
    });

    it('should prevent infinite loops with sync triggering', async () => {
      const conceptA: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ triggered: true })
      };

      const conceptB: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ synced: true })
      };

      engine.registerConcept('A', conceptA);
      engine.registerConcept('B', conceptB);

      const syncAtoB: SyncRule = {
        name: 'AtoB',
        when: [{ concept: 'A', action: 'actionA' }],
        then: [{ concept: 'B', action: 'actionB', input: {} }]
      };

      const syncBtoA: SyncRule = {
        name: 'BtoA',
        when: [{ concept: 'B', action: 'actionB' }],
        then: [{ concept: 'A', action: 'actionA', input: {} }]
      };

      engine.registerSync(syncAtoB);
      engine.registerSync(syncBtoA);

      await engine.invoke('A', 'actionA', {}, 'flow1');

      // Each concept should be called exactly once
      expect(conceptA.execute).toHaveBeenCalledTimes(1);
      expect(conceptB.execute).toHaveBeenCalledTimes(1);
    });

    it('should not trigger sync multiple times for same action', async () => {
      const triggerConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ count: 1 })
      };

      const syncConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ processed: true })
      };

      engine.registerConcept('counter', triggerConcept);
      engine.registerConcept('processor', syncConcept);

      const syncRule: SyncRule = {
        name: 'counterSync',
        when: [{ concept: 'counter', action: 'increment' }],
        then: [{ concept: 'processor', action: 'handle', input: { value: '?count' } }]
      };

      engine.registerSync(syncRule);

      await engine.invoke('counter', 'increment', {}, 'flow1');

      expect(syncConcept.execute).toHaveBeenCalledTimes(1);
      expect(syncConcept.execute).toHaveBeenCalledWith('handle', { value: 1 });
    });

    it('should handle nested variable extraction', async () => {
      const triggerConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ user: { id: 456, profile: { name: 'Jane' } } })
      };

      const syncConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ notified: true })
      };

      engine.registerConcept('user', triggerConcept);
      engine.registerConcept('notifier', syncConcept);

      const syncRule: SyncRule = {
        name: 'nestedSync',
        when: [{ concept: 'user', action: 'update' }],
        then: [{
          concept: 'notifier',
          action: 'notify',
          input: { userId: '?user.id', userName: '?user.profile.name' }
        }]
      };

      engine.registerSync(syncRule);

      await engine.invoke('user', 'update', { changes: {} }, 'flow1');

      expect(syncConcept.execute).toHaveBeenCalledWith('notify', { userId: 456, userName: 'Jane' });
    });

    it('should filter bindings using Query.where', async () => {
      const triggerExecute = jest.fn();
      const triggerConcept: Concept = {
        state: {},
        execute: triggerExecute
      };

      const syncConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ notified: true })
      };

      engine.registerConcept('user', triggerConcept);
      engine.registerConcept('notifier', syncConcept);

      const syncRule: SyncRule = {
        name: 'premiumNotification',
        when: [{ concept: 'user', action: 'register' }],
        where: {
          filter: (bindings) => {
            const email = bindings.email as string;
            return email?.endsWith('@premium.com') || false;
          }
        },
        then: [{
          concept: 'notifier',
          action: 'notify',
          input: { email: '?email' }
        }]
      };

      engine.registerSync(syncRule);

      // Mock first call to return premium email (should trigger)
      triggerExecute.mockResolvedValueOnce({ email: 'user@premium.com' });
      await engine.invoke('user', 'register', {}, 'flow1');
      expect(syncConcept.execute).toHaveBeenCalledTimes(1);
      expect(syncConcept.execute).toHaveBeenCalledWith('notify', { email: 'user@premium.com' });

      // Mock second call to return free email (should not trigger for this user)
      triggerExecute.mockResolvedValueOnce({ email: 'user@free.com' });
      await engine.invoke('user', 'register', {}, 'flow2');
      // The sync should not have triggered for the free user, so still 1 call
      expect(syncConcept.execute).toHaveBeenCalledTimes(1);
    });

    it('should rollback successful actions when a sync then action fails', async () => {
      const successConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ success: true }),
        rollback: jest.fn().mockResolvedValue(undefined)
      };

      const failConcept: Concept = {
        state: {},
        execute: jest.fn().mockRejectedValue(new Error('Action failed'))
      };

      engine.registerConcept('success', successConcept);
      engine.registerConcept('fail', failConcept);

      const syncRule: SyncRule = {
        name: 'rollbackTest',
        when: [{
          concept: 'trigger',
          action: 'start'
        }],
        then: [
          {
            concept: 'success',
            action: 'first',
            input: { step: 1 }
          },
          {
            concept: 'fail',
            action: 'second',
            input: { step: 2 }
          },
          {
            concept: 'success',
            action: 'third',
            input: { step: 3 }
          }
        ]
      };

      engine.registerSync(syncRule);

      const triggerConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ started: true })
      };
      engine.registerConcept('trigger', triggerConcept);

      // Invoke the trigger
      await engine.invoke('trigger', 'start', {}, 'flow1');

      // Check that first action was executed and rolled back
      expect(successConcept.execute).toHaveBeenCalledWith('first', { step: 1 });
      expect(successConcept.rollback).toHaveBeenCalledWith('first', { step: 1 }, { success: true });

      // Check that second action was executed but not rolled back (it failed)
      expect(failConcept.execute).toHaveBeenCalledWith('second', { step: 2 });

      // Check that third action was not executed
      expect(successConcept.execute).not.toHaveBeenCalledWith('third', { step: 3 });
    });
  });

  describe('Flow Management', () => {
    it('should track actions by flow', async () => {
      const concept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ done: true })
      };

      engine.registerConcept('test', concept);

      await engine.invoke('test', 'action1', {}, 'flow1');
      await engine.invoke('test', 'action2', {}, 'flow2');
      await engine.invoke('test', 'action3', {}, 'flow1');

      const flow1Actions = engine.getActionsByFlow('flow1');
      const flow2Actions = engine.getActionsByFlow('flow2');

      expect(flow1Actions).toHaveLength(2);
      expect(flow2Actions).toHaveLength(1);
      expect(flow1Actions.map(a => a.action)).toEqual(['action1', 'action3']);
    });
  });

  describe('State Management', () => {
    it('should clear a specific flow', async () => {
      const concept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ done: true })
      };
      engine.registerConcept('test', concept);

      await engine.invoke('test', 'action1', {}, 'flow1');
      await engine.invoke('test', 'action2', {}, 'flow2');

      expect(engine.getActionsByFlow('flow1')).toHaveLength(1);
      expect(engine.getActionsByFlow('flow2')).toHaveLength(1);

      engine.clearFlow('flow1');

      expect(engine.getActionsByFlow('flow1')).toHaveLength(0);
      expect(engine.getActionsByFlow('flow2')).toHaveLength(1);
    });

    it('should reset the engine state', async () => {
      const concept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ done: true })
      };
      engine.registerConcept('test', concept);

      await engine.invoke('test', 'action1', {}, 'flow1');
      await engine.invoke('test', 'action2', {}, 'flow2');

      expect(engine.getActionsByFlow('flow1')).toHaveLength(1);
      expect(engine.getActionsByFlow('flow2')).toHaveLength(1);

      engine.reset();

      expect(engine.getActionsByFlow('flow1')).toHaveLength(0);
      expect(engine.getActionsByFlow('flow2')).toHaveLength(0);
    });
  });

  describe('Queue Integration', () => {
    it('should accept a queue in constructor', () => {
      const queue = QueueFactory.create({ backend: 'sqlite' });
      const engineWithQueue = new LegibleEngine(queue);
      expect(engineWithQueue).toBeDefined();
      queue.close();
    });

    it('should work without queue', () => {
      const engineNoQueue = new LegibleEngine();
      expect(engineNoQueue).toBeDefined();
    });

    it('should process queue messages', async () => {
      const queue = QueueFactory.create({ backend: 'sqlite' });
      const engineWithQueue = new LegibleEngine(queue);

      const mockConcept: Concept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ processed: true })
      };

      engineWithQueue.registerConcept('test', mockConcept);

      // Enqueue a message
      await queue.enqueue({
        id: 'msg-1',
        payload: {
          type: 'invoke',
          concept: 'test',
          action: 'testAction',
          input: { data: 'test' },
          flowId: 'flow1',
          fromSync: false
        },
        timestamp: Date.now()
      });

      // Process the message
      const processed = await engineWithQueue.processQueueMessage();
      expect(processed).toBe(true);
      expect(mockConcept.execute).toHaveBeenCalledWith('testAction', { data: 'test' });

      // Queue should be empty now
      const empty = await engineWithQueue.processQueueMessage();
      expect(empty).toBe(false);

      await queue.close();
    });

    it('should throw error when processing queue without queue configured', async () => {
      const engineNoQueue = new LegibleEngine();
      await expect(engineNoQueue.processQueueMessage()).rejects.toThrow('No queue configured for processing');
    });
  });
});