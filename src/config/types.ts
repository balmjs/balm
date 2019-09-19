// Utils
interface ColorStyle {
  modifier?: string;
  color: string;
  background?: boolean;
  bright?: boolean;
  symbol?: string;
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

interface Vendor {
  key: string;
  value: string[];
}

// Server
interface ProxyConfig {
  context: string | string[];
  options: object;
}

export { ColorStyle, PostcssLoaderOptions, ObjectEntry, Vendor, ProxyConfig };
