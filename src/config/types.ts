// Utils
interface ColorStyle {
  modifier?: string;
  color: string;
  background?: boolean;
  bright?: boolean;
  symbol?: string;
}

interface LogOptions {
  logLevel: number;
  pre?: boolean;
}

// Styles
interface PostcssLoaderOptions {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  stringifier?: string | object;
  config?: object;
  // plugins: object[] | Function; // NOTE: The same to `styles.postcssPlugins`
  sourceMap: string | boolean;
}

// Scripts
interface ObjectEntry {
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

// Ftp
interface FtpConfig {
  host: string | undefined;
  port?: number;
  username?: string;
  password?: string | null;
  remotePath?: string;
}

// Publish
interface TemplateOption {
  input: string;
  output: string;
  options: object;
}

// Plugins
interface BalmPlugins {
  postcss: () => object[];
  rename: (options: any) => any;
  sftp: (options: any) => any;
}

interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

export {
  ColorStyle,
  LogOptions,
  PostcssLoaderOptions,
  ObjectEntry,
  BalmVendor,
  ProxyConfig,
  FtpConfig,
  TemplateOption,
  BalmPlugins,
  RenameOptions
};
