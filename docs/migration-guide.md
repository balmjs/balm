# BalmJS 4.0 迁移指南

## 概述

BalmJS 4.0 是一个重大版本升级，引入了现代化的构建工具和开发体验。本指南将帮助您从 BalmJS 3.x 平滑迁移到 4.0。

## 主要变更

### 🚀 新特性

- **Vite 集成**: 支持 Vite 作为构建工具，提供极快的开发服务器启动和热更新
- **SWC 编译器**: 可选择使用 SWC 替代 Babel，获得 10-20 倍的编译性能提升
- **ES2022+ 支持**: 完整支持最新的 JavaScript 特性
- **增强错误处理**: 智能错误分析、代码框架生成和解决方案建议
- **类型安全配置**: 完整的 TypeScript 类型定义和 IDE 智能提示

### ⚠️ 破坏性变更

- Node.js 最低版本要求提升至 16.0.0
- 部分配置选项结构调整
- 插件 API 更新

## 迁移步骤

### 1. 环境准备

#### 更新 Node.js 版本

```bash
# 检查当前 Node.js 版本
node --version

# 如果版本低于 16.0.0，请升级
# 推荐使用 nvm 管理 Node.js 版本
nvm install 16
nvm use 16
```

#### 更新 BalmJS

```bash
# 卸载旧版本
npm uninstall balm

# 安装新版本
npm install balm@4.0.0 --save-dev
```

### 2. 配置文件迁移

#### 自动迁移工具

BalmJS 4.0 提供了自动迁移工具：

```bash
# 运行迁移工具
npx balm migrate

# 或者手动指定配置文件
npx balm migrate --config balm.config.js
```

迁移工具会：
- 备份原配置文件
- 自动转换配置结构
- 生成迁移报告
- 提供手动调整建议

#### 手动迁移配置

如果您选择手动迁移，以下是主要的配置变更：

##### 基础配置结构

**BalmJS 3.x:**
```javascript
module.exports = {
  roots: {
    source: 'src',
    target: 'dist'
  },
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images'
    }
  },
  styles: {
    extname: 'scss'
  },
  scripts: {
    entry: {
      main: './src/scripts/main.js'
    }
  }
};
```

**BalmJS 4.0:**
```javascript
module.exports = {
  // 新增：构建工具选择
  bundler: 'webpack', // 或 'vite'
  
  // 新增：编译器选择
  compiler: {
    primary: 'babel', // 或 'swc'
    target: 'es2020'
  },
  
  // 路径配置简化
  paths: {
    src: 'src',
    dist: 'dist',
    public: 'public'
  },
  
  // CSS 配置整合
  css: {
    preprocessor: 'scss',
    modules: true
  },
  
  // JavaScript 配置整合
  scripts: {
    entry: {
      main: './src/scripts/main.js'
    }
  }
};
```

##### TypeScript 配置

**新增 TypeScript 支持配置:**

```javascript
module.exports = {
  compiler: {
    typescript: {
      configFile: 'tsconfig.json',
      typeCheck: true
    }
  }
};
```

##### Vite 配置

**启用 Vite 构建:**

```javascript
module.exports = {
  bundler: 'vite',
  
  // Vite 特定配置
  vite: {
    plugins: [],
    optimizeDeps: {
      include: ['lodash']
    }
  }
};
```

##### SWC 配置

**启用 SWC 编译器:**

```javascript
module.exports = {
  compiler: {
    primary: 'swc',
    swc: {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true
        }
      }
    }
  }
};
```

### 3. 依赖更新

#### 更新相关依赖

```bash
# 更新 Webpack 相关依赖（如果使用 Webpack）
npm update webpack webpack-cli

# 安装 Vite 依赖（如果使用 Vite）
npm install vite @vitejs/plugin-react --save-dev

# 安装 SWC 依赖（如果使用 SWC）
npm install @swc/core @swc/helpers --save-dev
```

#### 移除不再需要的依赖

```bash
# 如果切换到 SWC，可以移除 Babel 相关依赖
npm uninstall @babel/core @babel/preset-env @babel/preset-react

# 如果切换到 Vite，可以移除部分 Webpack 插件
npm uninstall webpack-dev-server html-webpack-plugin
```

### 4. 脚本命令更新

#### package.json 脚本更新

**BalmJS 3.x:**
```json
{
  "scripts": {
    "dev": "balm",
    "build": "balm -p"
  }
}
```

**BalmJS 4.0:**
```json
{
  "scripts": {
    "dev": "balm dev",
    "build": "balm build",
    "preview": "balm preview"
  }
}
```

### 5. 插件迁移

#### 自定义插件更新

如果您使用了自定义插件，需要更新插件 API：

**BalmJS 3.x:**
```javascript
// 旧的插件 API
mix.define('myTask', () => {
  // 插件逻辑
});
```

**BalmJS 4.0:**
```javascript
// 新的插件 API
const { definePlugin } = require('balm');

module.exports = definePlugin('myTask', {
  apply(api) {
    // 插件逻辑
  }
});
```

## 常见问题解答

### Q: 迁移后构建失败怎么办？

A: 请按以下步骤排查：

1. 检查 Node.js 版本是否 >= 16.0.0
2. 清除缓存：`rm -rf node_modules package-lock.json && npm install`
3. 检查配置文件语法是否正确
4. 查看错误日志，BalmJS 4.0 提供了更详细的错误信息

### Q: 如何选择 Webpack 还是 Vite？

A: 选择建议：

- **选择 Vite**：新项目、追求极致开发体验、项目规模中小型
- **选择 Webpack**：大型项目、需要复杂配置、依赖特定 Webpack 插件

### Q: SWC 和 Babel 如何选择？

A: 选择建议：

- **选择 SWC**：追求编译性能、使用标准语法特性
- **选择 Babel**：需要特殊转换插件、复杂的自定义转换

### Q: 现有项目的兼容性如何？

A: BalmJS 4.0 保持了良好的向后兼容性：

- 大部分 3.x 配置可以直接使用
- 提供自动迁移工具
- 渐进式升级，可以逐步启用新特性

## 性能对比

### 开发服务器启动时间

| 项目规模 | BalmJS 3.x (Webpack) | BalmJS 4.0 (Vite) | 提升 |
|---------|---------------------|-------------------|------|
| 小型项目 | 3-5s | 0.5-1s | 5-10x |
| 中型项目 | 8-15s | 1-2s | 8-15x |
| 大型项目 | 20-30s | 2-4s | 10-15x |

### 编译性能

| 编译器 | 小型项目 | 中型项目 | 大型项目 |
|-------|---------|---------|---------|
| Babel | 2-3s | 8-12s | 30-45s |
| SWC | 0.2-0.3s | 0.8-1.2s | 2-3s |
| 提升倍数 | 10x | 10x | 15x |

## 最佳实践

### 1. 渐进式迁移

建议按以下顺序逐步迁移：

1. 首先更新 BalmJS 版本，保持原有配置
2. 测试基本功能正常后，尝试启用 SWC
3. 在开发环境测试 Vite 集成
4. 最后在生产环境应用新配置

### 2. 配置优化

```javascript
// 推荐的 4.0 配置
module.exports = {
  bundler: 'vite', // 开发环境使用 Vite
  
  compiler: {
    primary: 'swc', // 使用 SWC 提升性能
    target: 'es2020' // 现代浏览器目标
  },
  
  // 启用现代特性
  features: {
    topLevelAwait: true,
    privateFields: true
  },
  
  // 优化配置
  optimization: {
    treeShaking: true,
    minimize: true
  }
};
```

### 3. 错误处理

利用新的错误处理系统：

```javascript
module.exports = {
  errorHandling: {
    enhanced: true, // 启用增强错误处理
    suggestions: true, // 启用智能建议
    codeFrame: true // 显示代码框架
  }
};
```

## 获取帮助

如果在迁移过程中遇到问题：

1. 查看 [官方文档](https://balm.js.org)
2. 搜索 [GitHub Issues](https://github.com/balmjs/balm/issues)
3. 提交新的 Issue 或讨论
4. 加入社区讨论群

## 总结

BalmJS 4.0 带来了显著的性能提升和开发体验改善。虽然迁移需要一些工作，但新版本的优势值得这些努力。建议在测试环境充分验证后再应用到生产环境。

记住：迁移是一个渐进的过程，不必一次性启用所有新特性。可以根据项目需求和团队情况逐步采用新功能。