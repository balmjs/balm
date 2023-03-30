import { platform } from 'node:process';
import { pathToFileURL } from 'node:url';

export const isWindows = platform === 'win32';

export const dynamicImport = (path, useDefault = true) =>
  import(pathToFileURL(path)).then((module) =>
    useDefault ? module.default : module
  );
