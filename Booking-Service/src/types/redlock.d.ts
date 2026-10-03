declare module 'redlock' {
  import { EventEmitter } from 'events';
  import { Redis } from 'ioredis';

  interface Settings {
    driftFactor: number;
    retryCount: number;
    retryDelay: number;
    retryJitter: number;
    automaticExtensionThreshold: number;
  }

  interface RedlockAbortSignal extends AbortSignal {
    error?: Error;
  }

  export class Lock {
    release(): Promise<unknown>;
  }

  export class ResourceLockedError extends Error {}

  export default class Redlock extends EventEmitter {
    constructor(clients: Iterable<Redis>, settings?: Partial<Settings>);
    acquire(resources: string[], duration: number): Promise<Lock>;
    using<T>(
      resources: string[],
      duration: number,
      routine: (signal: RedlockAbortSignal) => Promise<T>,
    ): Promise<T>;
  }
}
