import net from 'net';
import address from './address.js';
import { BalmError } from '@balm-core/index';

const UTIL_NAME = 'detect port';
const MAX_PORT = 65535;

function listen(
  port: number,
  host: string | null | undefined,
  callback: Function
): void {
  const server = new net.Server();

  server.on('error', (error: BalmError) => {
    server.close();

    if (error.code === 'ENOTFOUND') {
      BalmJS.logger.error(
        UTIL_NAME,
        `ignore dns ENOTFOUND error, get free ${host as string}:${port}`,
        {
          logLevel: BalmJS.LogLevel.Debug
        }
      );
      return callback(null, port);
    }

    return callback(error);
  });

  server.listen(port, host as string, () => {
    port = (server.address() as { port: number }).port;
    server.close();

    BalmJS.logger.debug(UTIL_NAME, `get free ${host as string}:${port}`);

    return callback(null, port);
  });
}

function tryListen(
  port: number,
  maxPort: number,
  host: string | null,
  callback: Function
): void {
  function handleError(err?: BalmError): void {
    if (err) {
      BalmJS.logger.error(UTIL_NAME, err.message, {
        logLevel: BalmJS.LogLevel.Debug
      });
    }

    port++;

    if (port >= maxPort) {
      BalmJS.logger.warn(
        UTIL_NAME,
        `port: ${port} >= maxPort: ${maxPort}, give up and use random port`,
        {
          logLevel: BalmJS.LogLevel.Debug
        }
      );
      port = 0;
      maxPort = 0;
    }

    tryListen(port, maxPort, host, callback);
  }

  if (host) {
    listen(port, host, (error: BalmError, realPort: number) => {
      if (error) {
        if (error.code === 'EADDRNOTAVAIL') {
          return callback(
            new Error('the ip that is not unkonwn on the machine')
          );
        }
        return handleError();
      }

      callback(null, realPort);
    });
  } else {
    // 1. check null
    listen(port, null, (error: BalmError, realPort: number) => {
      // ignore random listening
      if (port === 0) {
        return callback(error, realPort);
      }

      if (error) {
        return handleError(error);
      }

      // 2. check 0.0.0.0
      listen(port, '0.0.0.0', (error: BalmError) => {
        if (error) {
          return handleError(error);
        }

        // 3. check localhost
        listen(port, 'localhost', (error: BalmError) => {
          // if localhost refer to the ip that is not unkonwn on the machine, you will see the error EADDRNOTAVAIL
          // https://stackoverflow.com/questions/10809740/listen-eaddrnotavail-error-in-node-js
          if (error && error.code !== 'EADDRNOTAVAIL') {
            return handleError(error);
          }

          // 4. check current ip
          listen(port, address.ip(), (error: BalmError, realPort: number) => {
            if (error) {
              return handleError(error);
            }

            callback(null, realPort);
          });
        });
      });
    });
  }
}

function detectPort(port: number, host: string | null): Promise<any> {
  let maxPort: number = port + 10;
  if (maxPort > MAX_PORT) {
    maxPort = MAX_PORT;
  }

  BalmJS.logger.debug(
    UTIL_NAME,
    `detect free port between [${port}, ${maxPort}]`
  );

  return new Promise((resolve) => {
    tryListen(port, maxPort, host, (error: BalmError, realPort: number) => {
      resolve(realPort);
    });
  });
}

export default detectPort;
