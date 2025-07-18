# BalmJS Vite 集成指南

## 概述

BalmJS 4.0 引入了对 Vite 的完整支持，为开发者提供极速的开发服务器启动和热更新体验。本指南详细介绍如何在 BalmJS 项目中使用 Vite。

## 快速开始

### 基础配置

在 `balm.config.js` 中启用 Vite：

```javascript
module.exports = {
  bundler: 'vite',
  
  paths: {
    src: 'src',
    dist: 'dist',
    public: 'public'
  },
  
  devServer: {
    port: 3000,
    open: true
  }
};
```

### 启动开发服务器

```bash
npm run dev
```

Vite 开发服务器将在几百毫秒内启动，相比传统 Webpack 配置快 5-10 倍。

## 配置详解

### Vite 特定配置

```javascript
module.exports = {
  bundler: 'vite',
  
  // Vite 专用配置
  vite: {
    // 插件配置
    plugins: [
      // 自定义 Vite 插件
    ],
    
    // 依赖预构建
    optimizeDeps: {
      include: ['lodash', 'axios'],
      exclude: ['@balm/core']
    },
    
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      
      // Rollup 选项
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom']
          }
        }
      }
    },
    
    // 服务器配置
    server: {
      hmr: {
        overlay: true
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  }
};
```

### 框架集成

#### React 项目

```javascript
module.exports = {
  bundler: 'vite',
  framework: 'react',
  
  compiler: {
    typescript: true,
    jsx: true
  },
  
  vite: {
    plugins: [
      // React 插件会自动添加
    ]
  }
};
```

#### Vue 项目

```javascript
module.exports = {
  bundler: 'vite',
  framework: 'vue',
  
  vite: {
    plugins: [
      // Vue 插件会自动添加
    ]
  }
};
```

#### TypeScript 项目

```javascript
module.exports = {
  bundler: 'vite',
  
  compiler: {
    typescript: {
      configFile: 'tsconfig.json',
      typeCheck: true
    }
  }
};
```

## 开发体验优化

### 热模块替换 (HMR)

Vite 提供了极快的 HMR 体验：

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    server: {
      hmr: {
        port: 24678, // HMR 端口
        overlay: true, // 错误覆盖层
        clientPort: 3000 // 客户端端口
      }
    }
  }
};
```

### 环境变量

Vite 支持 `.env` 文件：

```bash
# .env.development
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=My App (Dev)

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

在代码中使用：

```javascript
// 只有以 VITE_ 开头的变量会暴露给客户端
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

### CSS 处理

#### CSS 预处理器

```javascript
module.exports = {
  bundler: 'vite',
  
  css: {
    preprocessor: 'scss', // 或 'less', 'stylus'
    
    // 预处理器选项
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
};
```

#### CSS Modules

```javascript
module.exports = {
  bundler: 'vite',
  
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
};
```

#### PostCSS

```javascript
module.exports = {
  bundler: 'vite',
  
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss')
      ]
    }
  }
};
```

## 构建优化

### 代码分割

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 将 React 相关库打包到单独的 chunk
            'react-vendor': ['react', 'react-dom'],
            
            // 将工具库打包到单独的 chunk
            'utils-vendor': ['lodash', 'axios', 'dayjs'],
            
            // 动态分割大型库
            'chart-vendor': ['echarts', 'd3']
          }
        }
      }
    }
  }
};
```

### 资源处理

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    build: {
      assetsInlineLimit: 4096, // 小于 4kb 的资源内联
      
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
              return `images/[name]-[hash][extname]`;
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `fonts/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          }
        }
      }
    }
  }
};
```

## 插件系统

### 使用 Vite 插件

```javascript
const { defineConfig } = require('vite');
const legacy = require('@vitejs/plugin-legacy');

module.exports = {
  bundler: 'vite',
  
  vite: {
    plugins: [
      // 传统浏览器支持
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      
      // 自定义插件
      {
        name: 'custom-plugin',
        configResolved(config) {
          // 插件逻辑
        }
      }
    ]
  }
};
```

### BalmJS 插件适配

BalmJS 会自动将部分插件适配到 Vite：

```javascript
module.exports = {
  bundler: 'vite',
  
  plugins: {
    // 这些插件会自动适配到 Vite
    html: {
      template: 'public/index.html',
      minify: true
    },
    
    copy: [
      { from: 'public/favicon.ico', to: 'favicon.ico' }
    ],
    
    pwa: {
      workboxOptions: {
        // PWA 配置
      }
    }
  }
};
```

## 性能优化

### 依赖预构建

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    optimizeDeps: {
      // 强制预构建
      include: [
        'lodash',
        'axios',
        'react > react/jsx-runtime'
      ],
      
      // 排除预构建
      exclude: [
        '@balm/core',
        'some-esm-package'
      ],
      
      // 自定义 esbuild 选项
      esbuildOptions: {
        target: 'es2020'
      }
    }
  }
};
```

### 构建性能

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    build: {
      // 启用/禁用 minification
      minify: 'esbuild', // 或 'terser', false
      
      // 构建目标
      target: 'es2015',
      
      // 启用/禁用 CSS 代码分割
      cssCodeSplit: true,
      
      // 生成 sourcemap
      sourcemap: process.env.NODE_ENV === 'development'
    }
  }
};
```

## 调试和开发工具

### 源码映射

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    build: {
      sourcemap: true // 或 'inline', 'hidden'
    }
  }
};
```

### 开发工具集成

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    server: {
      // 启用 HTTPS
      https: true,
      
      // 自定义中间件
      middlewareMode: false,
      
      // 文件系统严格模式
      fs: {
        strict: false,
        allow: ['..']
      }
    }
  }
};
```

## 常见问题

### Q: 如何处理 CommonJS 模块？

A: Vite 主要支持 ES 模块，对于 CommonJS 模块：

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    optimizeDeps: {
      include: [
        'commonjs-package' // 预构建 CommonJS 包
      ]
    },
    
    build: {
      commonjsOptions: {
        include: [/node_modules/]
      }
    }
  }
};
```

### Q: 如何处理动态导入？

A: Vite 原生支持动态导入：

```javascript
// 动态导入组件
const LazyComponent = lazy(() => import('./LazyComponent'));

// 动态导入模块
const module = await import('./utils');
```

### Q: 如何配置代理？

A: 在开发服务器中配置代理：

```javascript
module.exports = {
  bundler: 'vite',
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
```

## 最佳实践

### 1. 项目结构

```
src/
├── components/     # 组件
├── pages/         # 页面
├── utils/         # 工具函数
├── styles/        # 样式文件
├── assets/        # 静态资源
└── main.js        # 入口文件

public/            # 公共资源
├── favicon.ico
└── index.html

vite.config.js     # Vite 配置（可选）
balm.config.js     # BalmJS 配置
```

### 2. 环境配置

```javascript
// balm.config.js
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  bundler: 'vite',
  
  vite: {
    server: {
      port: isDev ? 3000 : undefined,
      open: isDev
    },
    
    build: {
      minify: !isDev,
      sourcemap: isDev
    }
  }
};
```

### 3. 性能监控

```javascript
module.exports = {
  bundler: 'vite',
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 自动分割大型依赖
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('lodash')) return 'utils-vendor';
              return 'vendor';
            }
          }
        }
      }
    }
  }
};
```

## 总结

Vite 集成为 BalmJS 带来了显著的性能提升和更好的开发体验。通过合理的配置和优化，可以充分发挥 Vite 的优势，提升开发效率和构建性能。

记住：
- 开发环境优先考虑启动速度和 HMR 性能
- 生产环境重点关注构建优化和资源分割
- 合理使用插件和中间件扩展功能
- 定期更新依赖以获得最新的性能改进