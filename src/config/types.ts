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

export {
  BalmEnv,
  ObjectEntry,
  BalmDefaultLoaders,
  ProxyConfig,
  TemplateOption
};
