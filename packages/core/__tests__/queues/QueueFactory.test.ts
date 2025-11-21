import { QueueFactory } from '../../src/queues/QueueFactory';

describe('QueueFactory', () => {
  it('should create SqliteQueue for sqlite backend', () => {
    const queue = QueueFactory.create({ backend: 'sqlite' });
    expect(queue).toBeDefined();
    // Close to avoid resource leaks
    queue.close();
  });

  it('should create SqliteQueue with custom filename', () => {
    const queue = QueueFactory.create({
      backend: 'sqlite',
      sqlite: { filename: ':memory:' }
    });
    expect(queue).toBeDefined();
    queue.close();
  });

  it('should throw error for unknown backend', () => {
    expect(() => {
      QueueFactory.create({ backend: 'unknown' as any });
    }).toThrow('Unknown queue backend: unknown');
  });

  it('should throw error for unimplemented backends', () => {
    expect(() => {
      QueueFactory.create({ backend: 'valkey' });
    }).toThrow('Valkey backend not implemented yet');

    expect(() => {
      QueueFactory.create({ backend: 'postgres' });
    }).toThrow('PostgreSQL backend not implemented yet');
  });
});