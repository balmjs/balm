import { TransformCallback } from 'stream';
import escapeRegExp from './escape-string-regexp';

interface ReplaceStreamOptions {
  limit: number;
  encoding: string;
  maxMatchLen: number;
  regExpFlags?: string;
  ignoreCase?: boolean;
}

function createReplaceFn(
  replace: string | Function,
  isRegEx: boolean
): Function {
  function regexReplaceFunction(...args: any): string {
    let newReplace = replace as string;

    // ability to us $1 with captures
    // Start at 1 and end at length - 2 to avoid the match parameter and offset
    // And string parameters
    const paramLength = [...args].length - 2;
    for (let i = 1; i < paramLength; i++) {
      newReplace = newReplace.replace(
        new RegExp(`\\$${i}`, 'g'),
        [...args][i] || ''
      );
    }

    return newReplace;
  }

  if (!(replace instanceof Function)) {
    return isRegEx
      ? regexReplaceFunction
      : (): string | Function => {
          return replace;
        };
  }

  return replace;
}

function matchFromRegex(regex: RegExp, options: ReplaceStreamOptions): RegExp {
  if (options.regExpFlags) {
    regex = new RegExp(regex.source, options.regExpFlags);
  }

  // If there is no global flag then there can only be one match
  if (!regex.global) {
    options.limit = 1;
  }

  return regex;
}

function matchFromString(str: string, options: ReplaceStreamOptions): RegExp {
  if (options.regExpFlags) {
    return new RegExp(escapeRegExp(str), options.regExpFlags);
  }

  return new RegExp(escapeRegExp(str), options.ignoreCase ? 'gmi' : 'gm');
}

function replaceStream(
  search: string | RegExp,
  replace: string | Function,
  opts?: object
): any {
  const readableStream = require('readable-stream');

  const options: ReplaceStreamOptions = Object.assign(
    {
      limit: Infinity,
      encoding: 'utf8',
      maxMatchLen: 100
    },
    opts
  );

  let tail = '';
  let totalMatches = 0;
  const isRegex = search instanceof RegExp;
  const replaceFn: Function = createReplaceFn(replace, isRegex);

  let match: RegExp;
  if (isRegex) {
    match = matchFromRegex(search as RegExp, options);
  } else {
    match = matchFromString(search as string, options);
    options.maxMatchLen = (search as string).length;
  }

  function getDataToAppend(
    this: any,
    before: string,
    match: RegExpExecArray
  ): string {
    let dataToAppend = before;

    totalMatches++;

    dataToAppend += isRegex
      ? replaceFn.apply(
          this,
          match.concat([match.index.toString(), match.input])
        )
      : replaceFn(match[0]);

    return dataToAppend;
  }

  function getDataToQueue(
    matchCount: number,
    haystack: string,
    rewritten: string,
    lastPos: number
  ): string {
    if (matchCount > 0) {
      if (haystack.length > tail.length) {
        return (
          rewritten + haystack.slice(lastPos, haystack.length - tail.length)
        );
      }

      return rewritten;
    }

    return haystack.slice(0, haystack.length - tail.length);
  }

  function transform(
    chunk: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    let matches;
    let lastPos = 0;
    let matchCount = 0;
    let rewritten = '';
    const haystack = `${tail}${chunk.toString(options.encoding)}`;
    tail = '';

    while (
      totalMatches < options.limit &&
      (matches = match.exec(haystack)) !== null
    ) {
      matchCount++;
      const before = haystack.slice(lastPos, matches.index);
      const regexMatch = matches;
      lastPos = matches.index + regexMatch[0].length;

      if (
        lastPos > haystack.length &&
        regexMatch[0].length < options.maxMatchLen
      ) {
        tail = regexMatch[0];
      } else {
        const dataToAppend = getDataToAppend(before, regexMatch);
        rewritten += dataToAppend;
      }
    }

    if (tail.length < 1)
      tail =
        haystack.slice(lastPos).length > options.maxMatchLen
          ? haystack.slice(lastPos).slice(0 - options.maxMatchLen)
          : haystack.slice(lastPos);

    const dataToQueue = getDataToQueue(
      matchCount,
      haystack,
      rewritten,
      lastPos
    );
    callback(null, dataToQueue);
  }

  function flush(this: any, callback: TransformCallback): void {
    if (tail) {
      this.push(tail);
    }

    callback();
  }

  return new readableStream.Transform({
    transform,
    flush
  });
}

export default replaceStream;
