import { Queue, QueueMessage } from '../Queue';

import * as sqlite3 from 'sqlite3';

export class SqliteQueue implements Queue {
  private db: any;
  private initialized = false;

  constructor(filename: string = ':memory:') {
    this.db = new sqlite3.Database(filename);
  }

  private async initTable(): Promise<void> {
    if (this.initialized) return;
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS queue (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        )
      `, (err: Error | null) => {
        if (err) reject(err);
        else {
          this.initialized = true;
          resolve();
        }
      });
    });
  }

  async enqueue(message: QueueMessage): Promise<void> {
    await this.initTable();
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO queue (id, payload, timestamp) VALUES (?, ?, ?)',
        [message.id, JSON.stringify(message.payload), message.timestamp],
        function(err: Error | null) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async dequeue(): Promise<QueueMessage | null> {
    await this.initTable();
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, payload, timestamp FROM queue ORDER BY timestamp ASC LIMIT 1',
        [],
        (err: Error | null, row: any) => {
          if (err) {
            reject(err);
          } else if (row) {
            this.db.run('DELETE FROM queue WHERE id = ?', [row.id], (deleteErr: Error | null) => {
              if (deleteErr) reject(deleteErr);
              else {
                resolve({
                  id: row.id,
                  payload: JSON.parse(row.payload),
                  timestamp: row.timestamp
                });
              }
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async size(): Promise<number> {
    await this.initTable();
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM queue', [], (err: Error | null, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.db.close(() => resolve());
    });
  }
}