import { v4 as uuid } from 'uuid';

export function generateIdempotencyKey(): string {
  //generate a unique idempotency key
  return uuid();
}
