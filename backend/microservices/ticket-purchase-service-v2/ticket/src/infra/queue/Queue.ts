export interface Queue {
  connect(): Promise<void>;
  close(): Promise<void>;
  on<T = unknown>(
    queueName: string,
    callback: (data: T) => Promise<void> | void,
  ): Promise<void>;
  publish(queueName: string, data: unknown): Promise<void>;
}
