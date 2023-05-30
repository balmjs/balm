import fs from 'node:fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  cssRegex,
  cssModuleRegex,
  sassRegex,
  sassModuleRegex
} from '../config/regex.js';
import { RuleSetRule } from '@balm-core/index';

// Check if Tailwind config exists
const useTailwind = fs.existsSync(
  node.path.join(BalmJS.config.workspace, 'tailwind.config.js')
);

// common function to get style loaders
function getStyleLoaders(
  styleLoader: string | object,
  cssOptions: object,
  preProcessor = '',
  sassOptions = {}
) {
  const { sourceMap } = cssOptions as { sourceMap: Boolean };

  const loaders = [
    BalmJS.config.env.isProd && BalmJS.config.scripts.extractCss
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: BalmJS.config.scripts.useEsModule
          }
        }
      : styleLoader,
    {
      loader: requireModule.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: requireModule.resolve('postcss-loader'),
      options: Object.assign(
        {
          postcssOptions: {
            plugins: BalmJS.plugins.postcssPlugins(true, useTailwind)
          },
          sourceMap
        },
        BalmJS.config.scripts.postcssLoaderOptions
      )
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: requireModule.resolve(preProcessor),
      options: Object.assign(
        {
          sourceMap: true
        },
        sassOptions
      )
    });
  }
  return loaders;
}

function cssLoader(): RuleSetRule[] {
  let styleLoader: string | object = {
    loader: requireModule.resolve('style-loader'),
    options: {
      esModule: BalmJS.config.scripts.useEsModule
    }
  };

  if (BalmJS.config.env.inSSR) {
    const loadersCount: number = BalmJS.config.scripts.loaders.length;
    for (let i = 0; i < loadersCount; i++) {
      if (
        (BalmJS.config.scripts.loaders[i] as { loader?: string }).loader ===
        'vue-loader'
      ) {
        styleLoader = 'vue-style-loader';
        break;
      }
    }
  }

  const sourceMap = BalmJS.config.env.isProd
    ? BalmJS.config.scripts.sourceMap
    : BalmJS.config.env.isDev;

  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use MiniCSSExtractPlugin to extract that CSS
  // to a file, but in development "style" loader enables hot editing
  // of CSS.
  // By default we support CSS Modules with the extension .module.css
  return [
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getStyleLoaders(styleLoader, {
        importLoaders: 1,
        sourceMap,
        modules: {
          mode: 'icss'
        },
        esModule: BalmJS.config.scripts.useEsModule
      }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true
    },
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        styleLoader,
        {
          importLoaders: 3,
          sourceMap,
          modules: {
            mode: 'icss'
          }
        },
        'sass-loader',
        {
          // Prefer `dart-sass`
          implementation: requireModule.resolve('sass'),
          sassOptions: Object.assign(
            {
              includePaths: BalmJS.file.stylePaths,
              outputStyle: 'expanded',
              quietDeps: BalmJS.config.logs.level < BalmJS.LogLevel.Warn
            },
            BalmJS.config.styles.sassOptions
          )
        }
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true
    }
  ];
}

export default cssLoader;
