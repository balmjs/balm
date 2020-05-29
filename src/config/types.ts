/* eslint no-undef: "off" */

// Environment
interface BalmEnvObject {
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  inSSR: boolean;
  isMP: boolean;
}

// Scripts
interface BalmEntryObject {
  [entryChunkName: string]: string | string[];
}

interface BalmVendor {
  key: string;
  value: string[];
}

// Server
interface ProxyConfig {
  context: string | string[];
  options: object;
}

// Hook
interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

interface HookOptions {
  src?: object;
  sass?: object;
  less?: object;
  terser?: object;
  rename?: string | Function | RenameOptions;
  ftp?: object;
}

interface SpriteOptions {
  extname?: string;
  imageBasePath?: string;
  imageTarget?: string; // NOTE: overwrite `BalmJS.config.paths.target.img`
  spriteRetina?: boolean;
  spriteParams?: object;
}

interface ReplaceOptions {
  substr: string | RegExp;
  replacement: string | Function;
}

// Publish
interface TemplateOption {
  input: string;
  output: string;
  renameOptions: string | Function | RenameOptions;
}

// Error
interface BalmError extends Error {
  code: string;
  details?: string;
}

export {
  BalmEnvObject,
  BalmEntryObject,
  BalmVendor,
  ProxyConfig,
  RenameOptions,
  HookOptions,
  SpriteOptions,
  ReplaceOptions,
  TemplateOption,
  BalmError
};
