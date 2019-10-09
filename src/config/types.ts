// Config
interface BalmEnv {
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  inSSR: boolean;
}

// Scripts
interface ObjectEntry {
  [entryChunkName: string]: string | string[];
}

interface BalmDefaultLoaders {
  html?: boolean;
  css?: boolean;
  js?: boolean;
  url?: boolean;
}

// Server
interface ProxyConfig {
  context: string | string[];
  options: object;
}

// Publish
interface TemplateOption {
  input: string;
  output: string;
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
  sassOptions?: object;
  lessOptions?: object;
  terserOptions?: object;
  renameOptions?: string | Function | RenameOptions;
  assetsOptions?: object;
  ftpOptions?: object;
  gulpSrcOptions?: object;
}

export {
  BalmEnv,
  ObjectEntry,
  BalmDefaultLoaders,
  ProxyConfig,
  TemplateOption,
  RenameOptions,
  HookOptions
};
