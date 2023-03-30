import { platform } from 'node:process';
import { pathToFileURL } from 'node:url';

export const isWindows = platform === 'win32';

export const dynamicImport = (path) =>
  import(pathToFileURL(path)).then((module) => module.default);
