// Reference `gulp-plumber@1.2.1`
import { EventEmitter } from 'events';
import { BalmError } from '@balm-core/index';

const PLUGIN_NAME = 'plumber';

const emitter = new EventEmitter();

function removeDefaultHandler(stream: any, event: string): boolean | Function {
  let found: boolean | Function = false;

  stream.listeners(event).forEach(function (this: any, item: Function) {
    if (item.name === `on${event}`) {
      found = item;
      this.removeListener(event, item);
    }
  }, stream);

  return found;
}

function wrapPanicOnErrorHandler(stream: any): void {
  const oldHandler = removeDefaultHandler(stream, 'error');

  if (oldHandler) {
    stream.on('error', function onerror2(this: any, error: BalmError) {
      if (emitter.listenerCount('error') === 1) {
        this.removeListener('error', onerror2);
        (oldHandler as Function).call(stream, error);
      }
    });
  }
}

function defaultErrorHandler(this: any, error: BalmError): any {
  // onerror2 and this handler
  if (emitter.listenerCount('error') < 3) {
    BalmJS.logger.error(
      `${PLUGIN_NAME} - found unhandled error`,
      error.toString()
    );
  }
}

function gulpPlumber(opts: any = {}): any {
  if (BalmJS.utils.isFunction(opts)) {
    opts = { errorHandler: opts };
  }

  const through = through2.obj();
  through._plumber = true;

  if (opts.errorHandler !== false) {
    through.errorHandler = BalmJS.utils.isFunction(opts.errorHandler)
      ? opts.errorHandler
      : defaultErrorHandler;
  }

  function patchPipe(stream: any): any {
    if (stream.pipe2) {
      wrapPanicOnErrorHandler(stream);
      stream._pipe = stream._pipe || stream.pipe;
      stream.pipe = stream.pipe2;
      stream._plumbed = true;
    }
  }

  through.pipe2 = function pipe2(this: any, dest: any): any {
    if (!dest) {
      throw new PluginError(PLUGIN_NAME, "Can't pipe to undefined");
    }

    this._pipe(dest);

    if (dest._unplumbed) {
      return dest;
    }

    removeDefaultHandler(this, 'error');

    if (dest._plumber) {
      return dest;
    }

    dest.pipe2 = pipe2;

    // Patching pipe method
    if (opts.inherit !== false) {
      patchPipe(dest);
    }

    // Placing custom on error handler
    if (this.errorHandler) {
      dest.errorHandler = this.errorHandler;
      dest.on('error', this.errorHandler.bind(dest));
    }

    dest._plumbed = true;

    return dest;
  };

  patchPipe(through);

  return through;
}

function stop(): any {
  const through = through2.obj();
  through._unplumbed = true;
  return through;
}

export default gulpPlumber;
export { stop };
