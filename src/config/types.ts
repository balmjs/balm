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

interface BalmVendor {
  key: string;
  value: string[];
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

// Hook
interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

// Publish
interface TemplateOption {
  input: string;
  output: string;
  renameOptions: string | Function | RenameOptions;
}

export {
  BalmEnv,
  ObjectEntry,
  BalmVendor,
  BalmDefaultLoaders,
  ProxyConfig,
  RenameOptions,
  TemplateOption
};
