# BalmJS 4.0 示例项目

本目录包含了 BalmJS 4.0 的各种示例项目，展示不同的配置和使用场景。

## 📁 示例项目列表

### 1. basic-webpack
**基础 Webpack 示例**
- 使用 Webpack 作为打包器
- Babel 编译器
- SCSS 预处理器
- 基础的代码分割和优化

```bash
cd examples/basic-webpack
npm install
npm run dev
```

### 2. typescript-react
**TypeScript + React 示例**
- 使用 Vite 作为打包器
- SWC 编译器（极速编译）
- TypeScript 支持
- React 18 + React Router
- SCSS + CSS Modules
- 完整的开发工具链

```bash
cd examples/typescript-react
npm install
npm run dev
```

### 3. vite-vue
**Vite + Vue 示例**
- 使用 Vite 作为打包器
- SWC 编译器
- Vue 3 + Vue Router + Pinia
- TypeScript 支持
- SCSS 预处理器
- 热模块替换

```bash
cd examples/vite-vue
npm install
npm run dev
```

## 🚀 快速开始

### 选择合适的示例

| 项目类型 | 推荐示例 | 特点 |
|---------|---------|------|
| 简单项目 | basic-webpack | 稳定、成熟的 Webpack 生态 |
| React 项目 | typescript-react | 现代化开发体验，类型安全 |
| Vue 项目 | vite-vue | 极速开发服务器，Vue 3 生态 |

### 通用启动步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd balm/examples/<example-name>
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

5. **预览构建结果**
```bash
npm run preview
```

## 📋 功能对比

| 功能 | basic-webpack | typescript-react | vite-vue |
|------|---------------|------------------|----------|
| 打包器 | Webpack | Vite | Vite |
| 编译器 | Babel | SWC | SWC |
| 框架 | 无 | React 18 | Vue 3 |
| TypeScript | ❌ | ✅ | ✅ |
| 热更新 | ✅ | ✅ | ✅ |
| CSS 预处理器 | SCSS | SCSS | SCSS |
| CSS Modules | ❌ | ✅ | ❌ |
| 代码分割 | ✅ | ✅ | ✅ |
| 开发服务器启动 | ~3-5s | ~0.5-1s | ~0.5-1s |

## 🛠️ 配置说明

### 打包器选择

#### Webpack
- **优势**: 生态成熟、插件丰富、配置灵活
- **适用**: 大型项目、复杂配置需求
- **启动时间**: 3-5 秒

#### Vite
- **优势**: 极速启动、现代化、开发体验好
- **适用**: 现代前端项目、快速开发
- **启动时间**: 0.5-1 秒

### 编译器选择

#### Babel
- **优势**: 生态成熟、插件丰富、兼容性好
- **适用**: 复杂转换需求、特殊语法支持
- **编译速度**: 标准

#### SWC
- **优势**: 极速编译（10-20x）、现代化
- **适用**: 标准语法、追求性能
- **编译速度**: 10-20 倍于 Babel

## 🎯 最佳实践

### 1. 项目选择建议

**新项目推荐顺序:**
1. `typescript-react` - React 项目首选
2. `vite-vue` - Vue 项目首选
3. `basic-webpack` - 简单项目或特殊需求

**现有项目迁移:**
1. 先使用 `basic-webpack` 验证兼容性
2. 逐步迁移到 Vite + SWC 配置

### 2. 性能优化

**开发环境:**
- 使用 Vite 获得极速启动
- 启用 SWC 编译器
- 合理配置代理和热更新

**生产环境:**
- 启用代码分割和 tree-shaking
- 配置资源优化和压缩
- 设置性能预算

### 3. 开发体验

**TypeScript 项目:**
- 启用类型检查
- 配置 ESLint 和 Prettier
- 使用 IDE 智能提示

**调试和测试:**
- 配置 source maps
- 集成测试框架
- 设置 CI/CD 流程

## 🔧 自定义配置

### 添加新的打包器

```javascript
// balm.config.js
export default {
  bundler: 'rollup', // 或 'esbuild'
  
  // 特定配置
  rollup: {
    // Rollup 特定选项
  }
};
```

### 切换编译器

```javascript
// balm.config.js
export default {
  compiler: {
    primary: 'swc', // 或 'babel', 'typescript'
    
    // 编译器特定配置
    swc: {
      jsc: {
        target: 'es2020'
      }
    }
  }
};
```

### 环境特定配置

```javascript
// balm.config.js
const isDev = process.env.NODE_ENV === 'development';

export default {
  bundler: isDev ? 'vite' : 'webpack',
  
  compiler: {
    primary: isDev ? 'swc' : 'babel'
  }
};
```

## 📚 相关文档

- [配置指南](../docs/configuration.md)
- [Vite 集成指南](../docs/vite-integration.md)
- [迁移指南](../docs/migration-guide.md)

## 🤝 贡献

欢迎提交新的示例项目或改进现有示例：

1. Fork 项目
2. 创建新的示例目录
3. 添加完整的配置和文档
4. 提交 Pull Request

## 📄 许可证

MIT License