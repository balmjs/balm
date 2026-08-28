import path from 'node:path';
import { BalmConfig, BundlerType } from '../types/index.js';

export function createDefaultConfig(workspace = process.cwd()): BalmConfig {
  const isProd = process.env.NODE_ENV === 'production';
  const isDev = !isProd;
  const isTest = process.env.NODE_ENV === 'test';

  const roots = {
    source: 'src',
    tmp: '.tmp',
    target: 'dist'
  };

  const paths = {
    source: {
      base: '',
      html: '',
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts',
      media: 'media'
    },
    tmp: {
      base: '',
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'fonts',
      media: 'media'
    },
    target: {
      base: '',
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font',
      media: 'media'
    }
  };

  const styles = {
    extname: 'scss',
    minify: false,
    atImportPaths: [],
    options: {},
    sassOptions: {},
    lessOptions: {},
    postcssLoaderOptions: {},
    postcssPlugins: [],
    sprites: [],
    spriteOptions: {}
  };

  const scripts = {
    bundler: BundlerType.webpack,
    minify: false,
    minifyOptions: {},
    entry: '',
    target: 'web',
    library: '',
    libraryTarget: 'var',
    externals: {},
    injectHtml: false,
    htmlName: 'index.html',
    alias: {},
    plugins: [],
    loaders: [],
    defaultLoaders: {
      html: true,
      css: true,
      js: true,
      url: true
    },
    options: {},
    esbuildOptions: {},
    rollupOptions: {},
    webpackOptions: {},
    useCache: false
  };

  const html = {
    options: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        compress: {
          drop_console: true
        }
      },
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }
  };

  const assets = {
    root: 'assets',
    mainDir: 'public',
    subDir: '',
    buildDir: 'build',
    virtualDir: '',
    cache: false,
    options: {
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: ['.html'],
      dontUpdateReference: []
    },
    includes: [],
    excludes: []
  };

  const server = {
    host: null,
    port: 3000,
    open: true,
    proxy: false,
    proxyOptions: false,
    historyOptions: false,
    useHMR: false,
    options: {}
  };

  const pwa = {
    enabled: false,
    mode: 'generateSW' as const,
    version: '',
    manifest: 'manifest.json',
    swSrcFilename: 'service-worker.js',
    swDestFilename: 'sw.js',
    options: {}
  };

  const ftp = {
    options: {},
    watchFiles: []
  };

  const images = {
    plugins: []
  };

  const env = {
    isProd,
    isDev,
    isTest,
    inFrontend: true,
    inSSR: false,
    inDesktopApp: false,
    isMP: false
  };

  const src = {
    base: path.join(workspace, roots.source),
    html: path.join(workspace, roots.source, paths.source.html),
    css: path.join(workspace, roots.source, paths.source.css),
    js: path.join(workspace, roots.source, paths.source.js),
    img: path.join(workspace, roots.source, paths.source.img),
    font: path.join(workspace, roots.source, paths.source.font),
    media: path.join(workspace, roots.source, paths.source.media)
  };

  const targetBase = path.join(workspace, isProd ? roots.target : roots.tmp);
  const dest = {
    base: targetBase,
    html: targetBase,
    css: path.join(targetBase, isProd ? paths.target.css : paths.tmp.css),
    js: path.join(targetBase, isProd ? paths.target.js : paths.tmp.js),
    img: path.join(targetBase, isProd ? paths.target.img : paths.tmp.img),
    font: path.join(targetBase, isProd ? paths.target.font : paths.tmp.font),
    media: path.join(targetBase, isProd ? paths.target.media : paths.tmp.media),
    static: path.join(targetBase, assets.virtualDir, assets.subDir)
  };

  return {
    workspace,
    env,
    inFrontend: true,
    useDefaults: true,
    roots,
    paths,
    styles,
    scripts,
    html,
    assets,
    server,
    pwa,
    ftp,
    images,
    logs: {
      level: 1
    },
    src,
    dest
  };
}
