/**
 * BalmJS 4.0 TypeScript + React Example
 * 展示 TypeScript 配置和 React 集成，使用 SWC 编译器
 */

// 使用 JSDoc 类型注释替代 import
/** @type {import('balm').ModernBalmConfig} */
const config = {
  // 构建模式
  mode: process.env.NODE_ENV || 'development',
  
  // 使用 Vite 作为打包器（更快的开发体验）
  bundler: 'vite',
  
  // 目标框架
  framework: 'react',
  
  // 路径配置
  paths: {
    src: 'src',
    dist: 'dist',
    public: 'public'
  },
  
  // 开发服务器配置
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    https: false,
    
    // 历史路由支持
    historyApiFallback: true,
    
    // API 代理
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  
  // 编译器配置
  compiler: {
    primary: 'swc',  // 使用 SWC 获得更快的 TypeScript 编译
    target: 'es2020',
    typescript: {
      configFile: 'tsconfig.json',
      typeCheck: true
    }
  },
  
  // CSS 配置
  css: {
    preprocessor: 'scss',
    modules: {
      localIdentName: '[name]__[local]___[hash:base64:5]'
    },
    
    // PostCSS 配置
    postcss: {
      plugins: [
        'autoprefixer',
        'postcss-nested'
      ]
    }
  },
  
  // 资源优化
  assets: {
    images: {
      optimize: true,
      formats: ['webp', 'avif'],
      quality: {
        webp: 85,
        avif: 75
      }
    },
    
    fonts: {
      preload: true,
      display: 'swap'
    },
    
    svg: {
      inline: true,
      optimize: true
    }
  },
  
  // 构建优化
  optimization: {
    minimize: true,
    treeShaking: true,
    deadCodeElimination: true,
    
    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 10
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 5
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 1
        }
      }
    },
    
    // 包分析
    analyzer: {
      enabled: process.env.ANALYZE === 'true',
      open: true
    }
  },
  
  // 插件配置
  plugins: {
    html: {
      template: 'public/index.html',
      title: 'BalmJS 4.0 TypeScript + React',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
        description: 'Modern React app built with BalmJS 4.0 and TypeScript'
      },
      minify: true
    },
    
    copy: [
      { from: 'public/favicon.ico', to: 'favicon.ico' },
      { from: 'public/manifest.json', to: 'manifest.json' }
    ],
    
    env: {
      include: ['NODE_ENV', 'REACT_APP_*'],
      defaults: {
        REACT_APP_VERSION: '1.0.0'
      }
    }
  },
  
  // 测试配置
  test: {
    framework: 'jest',
    environment: 'jsdom',
    setupFiles: ['<rootDir>/src/setupTests.ts'],
    
    coverage: {
      enabled: true,
      reporters: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  
  // 代码检查配置
  lint: {
    eslint: {
      enabled: true,
      config: '.eslintrc.js',
      fix: false
    },
    
    prettier: {
      enabled: true,
      config: '.prettierrc'
    }
  },
  
  // 性能预算
  performance: {
    budgets: [
      {
        type: 'initial',
        maximumWarning: '500kb',
        maximumError: '1mb'
      },
      {
        type: 'anyScript',
        maximumWarning: '200kb',
        maximumError: '400kb'
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '50kb',
        maximumError: '100kb'
      }
    ]
  },
  
  // 环境特定配置
  env: {
    development: {
      devServer: {
        overlay: {
          warnings: true,
          errors: true
        }
      },
      
      sourceMaps: {
        enabled: true,
        type: 'eval-source-map'
      }
    },
    
    production: {
      optimization: {
        minimize: true,
        minimizer: {
          js: 'swc',
          css: 'cssnano'
        }
      },
      
      sourceMaps: {
        enabled: false
      }
    }
  }
};

export default config;