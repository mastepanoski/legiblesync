import { Queue } from './Queue';
import { SqliteQueue } from './sqlite/SqliteQueue';

export type QueueBackend = 'sqlite' | 'valkey' | 'postgres';

export interface QueueConfig {
  backend: QueueBackend;
  sqlite?: {
    filename?: string;
  };
  valkey?: {
    url?: string;
  };
  postgres?: {
    connectionString?: string;
  };
}

export class QueueFactory {
  static create(config: QueueConfig): Queue {
    switch (config.backend) {
      case 'sqlite':
        return new SqliteQueue(config.sqlite?.filename);
      case 'valkey':
        throw new Error('Valkey backend not implemented yet');
      case 'postgres':
        throw new Error('PostgreSQL backend not implemented yet');
      default:
        throw new Error(`Unknown queue backend: ${config.backend}`);
    }
  }
}