import webpack, { Configuration, RuleSetRule } from 'webpack';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';
import { resolveDefaultEntry } from '../utilities/file.js';
import { deepMerge } from '../utilities/utils.js';

const coreRequire = createRequire(import.meta.url);

const BABEL_CONFIG_FILES = [
  'babel.config.js',
  'babel.config.cjs',
  'babel.config.mjs',
  'babel.config.json',
  '.babelrc',
  '.babelrc.js',
  '.babelrc.cjs',
  '.babelrc.json'
];

function resolveModule(pkgName: string, workspace: string): string {
  try {
    const workspaceRequire = createRequire(path.join(workspace, 'package.json'));
    return workspaceRequire.resolve(pkgName);
  } catch {
    return coreRequire.resolve(pkgName);
  }
}

function resolveWorkspacePaths(paths: string[] | undefined, workspace: string): string[] {
  if (!paths || !paths.length) return [];
  return paths.map((p) => (path.isAbsolute(p) ? p : path.resolve(workspace, p)));
}

function hasBabelConfig(config: BalmConfig): boolean {
  if (
    config.scripts.babelLoaderOptions &&
    Object.keys(config.scripts.babelLoaderOptions).length > 0
  ) {
    return true;
  }

  for (const filename of BABEL_CONFIG_FILES) {
    if (existsSync(path.join(config.workspace, filename))) {
      return true;
    }
  }

  const pkgPath = path.join(config.workspace, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg && pkg.babel) {
        return true;
      }
    } catch {
      // ignore malformed package.json
    }
  }

  return false;
}

function buildDefaultRules(
  config: BalmConfig,
  dirs: { imgDir: string; fontDir: string; mediaDir: string },
  devtool: boolean | string
): RuleSetRule[] {
  const isProd = config.env.isProd;
  const scripts = config.scripts;
  const esModule = scripts.useEsModule ?? true;
  const defaults = {
    html: true,
    css: true,
    js: true,
    url: true,
    ...(scripts.defaultLoaders || {})
  };

  const rules: RuleSetRule[] = [];

  if (defaults.html) {
    rules.push({
      test: /\.html$/i,
      exclude: /\.vue\.html$/i,
      loader: resolveModule('html-loader', config.workspace),
      options: {
        minimize: {
          removeAttributeQuotes: false
        },
        esModule,
        ...(scripts.htmlLoaderOptions || {})
      }
    });
  }

  if (defaults.css) {
    const cssSourceMap = Boolean(devtool);
    const MiniCssExtractPlugin = coreRequire('mini-css-extract-plugin');
    const styleLoader =
      isProd && scripts.extractCss
        ? {
            loader: MiniCssExtractPlugin.loader,
            options: { esModule }
          }
        : {
            loader: resolveModule('style-loader', config.workspace),
            options: { esModule }
          };

    const postcssPlugins = [
      ...(config.styles.postcssPlugins || []),
      autoprefixer(),
      postcssPresetEnv()
    ];

    const createCssUse = (isModule: boolean) => [
      styleLoader,
      {
        loader: resolveModule('css-loader', config.workspace),
        options: {
          importLoaders: 1,
          sourceMap: cssSourceMap,
          modules: isModule ? { auto: true } : { mode: 'icss' },
          esModule
        }
      },
      {
        loader: resolveModule('postcss-loader', config.workspace),
        options: {
          postcssOptions: {
            plugins: postcssPlugins
          },
          sourceMap: cssSourceMap,
          ...(scripts.postcssLoaderOptions || {})
        }
      }
    ];

    rules.push(
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: createCssUse(false),
        sideEffects: true
      },
      {
        test: /\.module\.css$/,
        use: createCssUse(true)
      }
    );
  }

  if (defaults.js && hasBabelConfig(config)) {
    const jsIncludes = [
      config.src.js,
      ...resolveWorkspacePaths(scripts.includeJsResource, config.workspace)
    ];

    rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: jsIncludes,
      loader: resolveModule('babel-loader', config.workspace),
      options: {
        cwd: config.workspace,
        ...(scripts.babelLoaderOptions || {})
      }
    });
  }

  if (defaults.url) {
    const rawLimit =
      scripts.urlLoaderOptions?.limit ??
      (process.env.IMAGE_INLINE_SIZE_LIMIT
        ? parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT, 10)
        : 10000);
    const maxSize = typeof rawLimit === 'number' && rawLimit > 0 ? rawLimit : 0;
    const excludeUrl = resolveWorkspacePaths(scripts.excludeUrlResource, config.workspace);

    const createAssetRule = (
      test: RegExp,
      targetDir: string,
      exclude?: string[]
    ): RuleSetRule => ({
      test,
      ...(exclude && exclude.length ? { exclude } : {}),
      type: maxSize > 0 ? 'asset' : 'asset/resource',
      ...(maxSize > 0
        ? {
            parser: {
              dataUrlCondition: {
                maxSize
              }
            }
          }
        : {}),
      generator: {
        filename: `${targetDir}/[name].[hash:8][ext]`
      }
    });

    rules.push(
      createAssetRule(/\.(bmp|gif|jpe?g|png|svg|webp)(\?.*)?$/i, dirs.imgDir, excludeUrl),
      createAssetRule(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i, dirs.mediaDir),
      createAssetRule(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i, dirs.fontDir)
    );
  }

  return rules;
}

export async function runWebpack(
  config: BalmConfig,
  customOptions: Configuration = {}
): Promise<webpack.Stats | undefined> {
  const isProd = config.env.isProd;

  let entry = customOptions.entry || config.scripts.entry;
  if (!entry) {
    entry = resolveDefaultEntry(config.src.js);
  }

  const rawOutputPath = customOptions.output?.path;
  const isCustomOutput = Boolean(rawOutputPath);
  const outputPath = isCustomOutput
    ? path.isAbsolute(rawOutputPath as string)
      ? (rawOutputPath as string)
      : path.resolve(config.workspace, rawOutputPath as string)
    : config.dest.base;

  const jsDir = isCustomOutput ? '' : isProd ? config.paths.target.js : config.paths.tmp.js;
  const imgDir = isProd ? config.paths.target.img : config.paths.tmp.img;
  const fontDir = isProd ? config.paths.target.font : config.paths.tmp.font;
  const mediaDir = isProd ? config.paths.target.media : config.paths.tmp.media;

  const devtool = config.scripts.sourceMap
    ? config.scripts.sourceMap === true
      ? isProd
        ? 'source-map'
        : 'eval-cheap-module-source-map'
      : (config.scripts.sourceMap as any)
    : isProd
      ? false
      : 'eval-cheap-module-source-map';

  const libraryConfig = config.scripts.library
    ? typeof config.scripts.library === 'string' &&
      config.scripts.libraryTarget &&
      config.scripts.libraryTarget !== 'var'
      ? { name: config.scripts.library, type: config.scripts.libraryTarget }
      : config.scripts.library
    : undefined;

  const defaultRules = buildDefaultRules(config, { imgDir, fontDir, mediaDir }, devtool);

  const plugins: any[] = [...(config.scripts.plugins || [])];
  if (isProd && config.scripts.extractCss) {
    const MiniCssExtractPlugin = coreRequire('mini-css-extract-plugin');
    const cssDir = config.paths.target.css;
    const cssFilename = config.assets.cache
      ? `${cssDir}/async/[name].[contenthash:8].css`
      : `${cssDir}/async/[name].css`;
    plugins.push(
      new MiniCssExtractPlugin({
        filename: cssFilename,
        chunkFilename: cssFilename
      })
    );
  }

  const vendorName = config.scripts.vendorName || 'vendor';
  const defaultOptimization: Record<string, any> = {
    minimize: isProd || config.scripts.minify
  };
  if (config.scripts.extractAllVendors) {
    const vendorFilename = isCustomOutput
      ? `${vendorName}.js`
      : isProd && config.assets.cache
        ? `${jsDir}/${vendorName}.[contenthash:8].js`
        : `${jsDir}/${vendorName}.js`;
    defaultOptimization.splitChunks = {
      cacheGroups: {
        vendors: {
          name: vendorName,
          chunks: 'initial',
          test: /[\\/](node_modules|bower_components)[\\/]/,
          filename: vendorFilename
        }
      }
    };
  }
  const optimization = deepMerge(
    {},
    defaultOptimization,
    config.scripts.optimization || {}
  );

  const externals =
    config.scripts.externals &&
    (typeof config.scripts.externals !== 'string' || config.scripts.externals.length > 0)
      ? (config.scripts.externals as any)
      : undefined;

  const defaultWebpackConfig: Configuration = {
    mode: isProd ? 'production' : 'development',
    context: config.workspace,
    entry,
    output: {
      path: outputPath,
      filename: isCustomOutput
        ? '[name].js'
        : isProd && config.assets.cache
          ? `${jsDir}/[name].[contenthash:8].js`
          : `${jsDir}/[name].js`,
      chunkFilename: isCustomOutput
        ? 'chunk/[name].js'
        : isProd && config.assets.cache
          ? `${jsDir}/chunk/[name].[chunkhash:8].js`
          : `${jsDir}/chunk/[name].js`,
      publicPath: config.assets.virtualDir ? `/${config.assets.virtualDir}/` : '/',
      ...(libraryConfig ? { library: libraryConfig as any } : {})
    },
    target: config.scripts.target || 'web',
    ...(externals !== undefined ? { externals } : {}),
    plugins,
    resolve: {
      modules: ['node_modules', config.src.base],
      extensions: [
        '.wasm',
        '.mjs',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.vue',
        '.json',
        ...(config.scripts.extensions || [])
      ],
      alias: {
        ...config.alias,
        ...config.scripts.alias
      }
    },
    module: {
      rules: [...defaultRules, ...(config.scripts.loaders || [])]
    },
    optimization,
    ...(config.scripts.stats !== undefined ? { stats: config.scripts.stats } : {}),
    devtool
  };

  const webpackConfig: Configuration = {
    ...defaultWebpackConfig,
    ...config.scripts.webpackOptions,
    ...customOptions,
    output: {
      ...defaultWebpackConfig.output,
      ...config.scripts.webpackOptions?.output,
      ...customOptions?.output,
      path: outputPath
    }
  };

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        logger.error('webpack', err.stack || err);
        compiler.close(() => reject(err));
        return;
      }

      if (stats?.hasErrors()) {
        const info = stats.toJson();
        logger.error('webpack', info.errors?.map((e) => e.message).join('\n'));
        compiler.close(() => reject(new Error('Webpack compilation errors')));
        return;
      }

      compiler.close((closeErr) => {
        if (closeErr) {
          return reject(closeErr);
        }
        resolve(stats);
      });
    });
  });
}
