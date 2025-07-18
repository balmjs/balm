# BalmJS 配置指南

BalmJS 4.0 引入了全新的现代化配置系统，提供更好的类型安全、验证和迁移支持。

## 配置文件

BalmJS 支持多种配置文件格式：

- `balm.config.js` - JavaScript 配置文件
- `balm.config.ts` - TypeScript 配置文件
- `balm.config.mjs` - ES 模块配置文件
- `balm.config.cjs` - CommonJS 配置文件
- `.balmrc` - JSON 配置文件
- `.balmrc.json` - JSON 配置文件

## 基础配置

### 最小配置

```javascript
// balm.config.js
export default {
  mode: 'development',
  bundler: 'webpack'
};
```

### 完整配置示例

```javascript
// balm.config.js
export default {
  // 构建模式
  mode: 'development', // 'development' | 'production' | 'test'
  
  // 打包器选择
  bundler: 'webpack', // 'webpack' | 'vite' | 'rollup' | 'esbuild'
  
  // 路径配置
  paths: {
    src: 'src',
    dist: 'dist',
    public: 'public',
    assets: 'assets'
  },
  
  // 开发服务器配置
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    https: false,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  
  // 编译器配置
  compiler: {
    primary: 'babel', // 'babel' | 'swc' | 'typescript' | 'esbuild'
    target: 'es2020',
    jsx: true,
    typescript: true
  }
};
```

## 配置选项详解

### 构建模式 (mode)

控制构建的目标环境和优化级别：

```javascript
{
  mode: 'development' // 开发模式，启用调试功能
  // mode: 'production' // 生产模式，启用优化
  // mode: 'test'       // 测试模式
}
```

### 打包器选择 (bundler)

选择使用的打包工具：

```javascript
{
  bundler: 'webpack',  // 默认，成熟稳定
  // bundler: 'vite',  // 快速开发，现代化
  // bundler: 'rollup', // 库打包优化
  // bundler: 'esbuild' // 极速构建
}
```

### 路径配置 (paths)

定义项目目录结构：

```javascript
{
  paths: {
    src: 'src',           // 源码目录
    dist: 'dist',         // 输出目录
    public: 'public',     // 静态资源目录
    assets: 'assets'      // 资源文件目录
  }
}
```

### 开发服务器 (devServer)

配置开发服务器选项：

```javascript
{
  devServer: {
    host: 'localhost',    // 服务器主机
    port: 3000,          // 端口号
    open: true,          // 自动打开浏览器
    https: false,        // 启用 HTTPS
    
    // 代理配置
    proxy: {
      '/api': 'http://localhost:3001',
      '/auth': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        pathRewrite: {
          '^/auth': ''
        }
      }
    },
    
    // 静态文件服务
    static: {
      directory: 'public',
      publicPath: '/'
    },
    
    // 历史路由回退
    historyApiFallback: true
  }
}
```

### 编译器配置 (compiler)

配置代码编译选项：

```javascript
{
  compiler: {
    primary: 'babel',     // 主编译器
    target: 'es2020',     // 目标 ES 版本
    jsx: true,           // 启用 JSX 支持
    typescript: true,    // 启用 TypeScript 支持
    
    // Babel 配置
    babel: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    },
    
    // SWC 配置
    swc: {
      minify: true,
      cache: true
    },
    
    // TypeScript 配置
    typescript: {
      configFile: 'tsconfig.json',
      typeCheck: true
    }
  }
}
```

## TypeScript 支持

BalmJS 4.0 提供完整的 TypeScript 支持：

```typescript
// balm.config.ts
import { ModernBalmConfig } from '@balm-core/types';

const config: ModernBalmConfig = {
  mode: 'development',
  bundler: 'webpack',
  paths: {
    src: 'src',
    dist: 'dist'
  },
  compiler: {
    primary: 'swc',
    typescript: true
  }
};

export default config;
```

## 环境特定配置

可以为不同环境提供特定配置：

```javascript
export default {
  mode: 'development',
  bundler: 'webpack',
  
  // 环境特定配置
  env: {
    development: {
      devServer: {
        port: 3000
      }
    },
    production: {
      compiler: {
        primary: 'swc' // 生产环境使用 SWC 提升性能
      }
    }
  }
};
```

## 配置验证

BalmJS 会自动验证配置并提供详细的错误信息：

```javascript
// 无效配置示例
export default {
  mode: 'invalid-mode',     // 错误：无效的模式
  bundler: 'unknown',       // 错误：不支持的打包器
  paths: {
    src: 123               // 错误：路径必须是字符串
  }
};
```

验证错误会显示：
```
❌ [CONFIG-VALUE-001] Invalid value for configuration property mode: invalid-mode
   Expected one of: development, production, test
   at balm.config.js:2:8

💡 Possible solutions:
   1. Use 'development' for development builds
   2. Use 'production' for production builds
   3. Use 'test' for testing environments
```

## 配置迁移

从旧版本升级时，BalmJS 会自动迁移配置：

```javascript
// 旧版本配置 (v3.x)
module.exports = {
  production: true,
  roots: {
    source: 'app',
    target: 'build'
  },
  server: {
    port: 8080,
    localOnly: false
  },
  scripts: {
    babel: true,
    target: 'es2018'
  }
};

// 自动迁移为新版本配置 (v4.x)
export default {
  mode: 'production',
  paths: {
    src: 'app',
    dist: 'build'
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  compiler: {
    primary: 'babel',
    target: 'es2018'
  }
};
```

## 最佳实践

### 1. 使用 TypeScript 配置

```typescript
// balm.config.ts
import { ModernBalmConfig } from '@balm-core/types';

const config: ModernBalmConfig = {
  // 配置内容
};

export default config;
```

### 2. 环境变量配置

```javascript
export default {
  mode: process.env.NODE_ENV || 'development',
  
  devServer: {
    port: parseInt(process.env.PORT) || 3000
  },
  
  // 使用环境变量控制功能
  compiler: {
    primary: process.env.USE_SWC ? 'swc' : 'babel'
  }
};
```

### 3. 条件配置

```javascript
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default {
  mode: process.env.NODE_ENV,
  
  // 开发环境特定配置
  ...(isDev && {
    devServer: {
      port: 3000,
      open: true
    }
  }),
  
  // 生产环境特定配置
  ...(isProd && {
    compiler: {
      primary: 'swc' // 生产环境使用更快的编译器
    }
  })
};
```

### 4. 配置复用

```javascript
// config/base.js
export const baseConfig = {
  paths: {
    src: 'src',
    dist: 'dist'
  },
  compiler: {
    target: 'es2020'
  }
};

// balm.config.js
import { baseConfig } from './config/base.js';

export default {
  ...baseConfig,
  mode: 'development',
  bundler: 'webpack'
};
```

## 常见问题

### Q: 如何从旧版本迁移配置？

A: BalmJS 4.0 提供自动迁移功能。运行 `balm migrate` 命令或直接使用新版本，系统会自动检测并迁移旧配置。

### Q: 如何选择合适的打包器？

A: 
- **webpack**: 功能最全面，生态最丰富，适合大型项目
- **vite**: 开发速度快，适合现代前端项目
- **rollup**: 适合库开发和打包
- **esbuild**: 构建速度最快，适合简单项目

### Q: 如何启用 TypeScript 支持？

A: 设置 `compiler.typescript: true` 并确保项目中有 `tsconfig.json` 文件。

### Q: 如何配置代理？

A: 在 `devServer.proxy` 中配置代理规则，支持字符串和对象格式。

### Q: 配置验证失败怎么办？

A: 查看错误信息中的建议，BalmJS 会提供详细的修复建议和文档链接。