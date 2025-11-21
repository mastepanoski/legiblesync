export interface QueueMessage {
  id: string;
  payload: any;
  timestamp: number;
}

export interface Queue {
  enqueue(message: QueueMessage): Promise<void>;
  dequeue(): Promise<QueueMessage | null>;
  size(): Promise<number>;
  close(): Promise<void>;
}