import { timingSafeEqual } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { serverConfig } from '../config';

function matchesCredential(supplied: string, expected: string): boolean {
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);

  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export function authenticateBullBoard(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { BULL_BOARD_USERNAME: username, BULL_BOARD_PASSWORD: password } = serverConfig;

  if (!username || !password) {
    response
      .status(503)
      .send(
        'BullMQ dashboard is unavailable until BULL_BOARD_USERNAME and BULL_BOARD_PASSWORD are configured.',
      );
    return;
  }

  const authorization = request.get('authorization');
  const basicAuth = authorization?.match(/^Basic\s+(.+)$/i);

  if (!basicAuth) {
    response.set('WWW-Authenticate', 'Basic realm="BullMQ Dashboard", charset="UTF-8"');
    response.status(401).send('Authentication required.');
    return;
  }

  const encodedCredentials = basicAuth[1];
  if (!encodedCredentials) {
    response.set('WWW-Authenticate', 'Basic realm="BullMQ Dashboard", charset="UTF-8"');
    response.status(401).send('Invalid dashboard credentials.');
    return;
  }

  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
  const separator = decodedCredentials.indexOf(':');
  const suppliedUsername = separator < 0 ? '' : decodedCredentials.slice(0, separator);
  const suppliedPassword = separator < 0 ? '' : decodedCredentials.slice(separator + 1);

  if (
    !matchesCredential(suppliedUsername, username) ||
    !matchesCredential(suppliedPassword, password)
  ) {
    response.set('WWW-Authenticate', 'Basic realm="BullMQ Dashboard", charset="UTF-8"');
    response.status(401).send('Invalid dashboard credentials.');
    return;
  }

  next();
}
