import { PassThrough } from 'node:stream';

function mergeStream(...args: any): any {
  let sources: any = [];
  const output: any = new PassThrough({ objectMode: true });

  output.setMaxListeners(0);

  function remove(source: any): void {
    sources = sources.filter((it: any) => {
      return it !== source;
    });
    if (!sources.length && output.readable) {
      output.end();
    }
  }

  function add(this: any, source: any): any {
    if (Array.isArray(source)) {
      source.forEach(add);
      return this;
    }

    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.once('error', output.emit.bind(output, 'error'));
    source.pipe(output, { end: false });
    return this;
  }

  function isEmpty(): boolean {
    return sources.length == 0;
  }

  output.add = add;
  output.isEmpty = isEmpty;

  output.on('unpipe', remove);

  [...args].slice().forEach(add);

  return output;
}

export default mergeStream;
