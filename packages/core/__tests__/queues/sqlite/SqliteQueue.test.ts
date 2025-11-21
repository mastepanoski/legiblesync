import { SqliteQueue } from '../../../src/queues/sqlite/SqliteQueue';

describe('SqliteQueue', () => {
  let queue: SqliteQueue;

  beforeEach(() => {
    queue = new SqliteQueue(':memory:');
  });

  afterEach(async () => {
    await queue.close();
  });

  it('should enqueue and dequeue a message', async () => {
    const message = {
      id: 'test-id',
      payload: { action: 'test' },
      timestamp: Date.now()
    };

    await queue.enqueue(message);
    expect(await queue.size()).toBe(1);

    const dequeued = await queue.dequeue();
    expect(dequeued).toEqual(message);
    expect(await queue.size()).toBe(0);
  });

  it('should return null when dequeueing from empty queue', async () => {
    const dequeued = await queue.dequeue();
    expect(dequeued).toBeNull();
  });

  it('should handle multiple messages in FIFO order', async () => {
    const message1 = { id: '1', payload: 'first', timestamp: 1 };
    const message2 = { id: '2', payload: 'second', timestamp: 2 };

    await queue.enqueue(message1);
    await queue.enqueue(message2);

    expect(await queue.size()).toBe(2);

    const dequeued1 = await queue.dequeue();
    expect(dequeued1).toEqual(message1);

    const dequeued2 = await queue.dequeue();
    expect(dequeued2).toEqual(message2);
  });
});