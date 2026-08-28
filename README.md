# BalmJS (6.x)

> Next-generation, universal frontend build workflow powered by pure native Node.js APIs. Zero Gulp, ultra-fast task DAG scheduler, and modern streaming pipeline.

[![npm version](https://img.shields.io/npm/v/balm.svg)](https://www.npmjs.com/package/balm)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Highlights in 6.x

- **🚫 Zero Gulp Dependency**: Completely liberated from Gulp / Undertaker / Vinyl. Built on top of modern Node.js原生 APIs (`node:stream/promises`, `node:fs/promises`, `node:events`).
- **⚡ Native Task DAG Engine**: Topological-sorted async scheduler with parallel wave execution, automatic dependency tracking, lifecycle hooks, and high-precision execution timings.
- **🌊 Composable File Pipeline**: Lightweight virtual file stream with modern compiler transforms (Dart Sass modern JS API, Less, PostCSS 8 + Autoprefixer + PresetEnv + CSSNano, HTML-Minifier-Terser, Terser 5).
- **📦 Multi-Bundler Support**: First-class support for **Webpack 5**, **Rollup 4**, and **ESBuild**.
- **🔒 Modern Asset Cache & Revisioning**: Native content-hashing (`[hash:8]`), cascade reference rewriting in HTML/CSS/JS, and `rev-manifest.json` generation.
- **🛠️ Fully Typed**: 100% written in TypeScript 5.x, emitting full `.d.ts` declaration maps and dual ESM/CJS bundles.
- **🧪 Fast Testing**: 100% Vitest-powered test suite.

---

## 📦 Monorepo Architecture

```
balm-next/
├── packages/
│   ├── balm-core/      # Core build engine, DAG runner, pipelines, bundlers, and task definitions
│   └── balm/           # CLI wrapper & bin executable (`balm`)
├── playground/         # Real-world playground and integration test environments
└── test/               # Comprehensive Vitest unit and integration test suites
```

---

## 📥 Installation

BalmJS adopts an efficient **two-tier package architecture** designed to save disk space and maximize installation speed:

### Step 1: Install `balm-core` Globally (Once per Machine)

`balm-core` is the heavy build engine containing Webpack, Rollup, ESBuild, Dart Sass, Less, PostCSS, and other compilers. **You only need to install it once globally on your machine**:

```bash
# Using npm
npm install -g balm-core

# Using pnpm
pnpm add -g balm-core

# Using yarn
yarn global add balm-core
```

### Step 2: Install `balm` in Your Project

`balm` is the ultra-lightweight project-level CLI and configuration interface. It automatically detects and binds to your global `balm-core`:

```bash
# Inside your project directory
npm install --save-dev balm

# or using pnpm
pnpm add -D balm

# or using yarn
yarn add -D balm
```

> **Tip**: If you prefer project-isolated dependencies without global installation, you can also install `balm-core` locally as a devDependency in your project alongside `balm`.


---

## 🎯 Quick Start

### 1. Configuration File (`balm.config.js`)

```javascript
import balm from 'balm';

balm.config = {
  roots: {
    source: 'src',
    target: 'dist'
  },
  styles: {
    extname: 'scss'
  },
  scripts: {
    bundler: 'esbuild', // 'webpack' | 'rollup' | 'esbuild'
    entry: {
      app: './src/scripts/main.js'
    }
  },
  assets: {
    cache: true
  }
};

balm.go((mix) => {
  if (balm.config.env.isProd) {
    mix.publish();
  }
});
```

### 2. CLI Execution

```bash
# Start development workflow with dev server & HMR
npx balm -d

# Build production artifacts with minification and cache hashing
npx balm -p
```

---

## 🧩 Recipe API (`mix.*`)

| Recipe Method | Description |
| :--- | :--- |
| `mix.copy(input, output, options)` | Copy files or directories to destination with optional rename |
| `mix.remove(target)` | Remove specified files or directories |
| `mix.replace(input, output, options)` | Search and replace text or regex patterns |
| `mix.sass(input, output, options)` | Compile Sass/SCSS files with PostCSS pipeline |
| `mix.less(input, output, options)` | Compile Less files with PostCSS pipeline |
| `mix.css(input, output, options)` | Process raw CSS files with PostCSS and autoprefixer |
| `mix.webpack(entry, output, options)` | Run custom Webpack 5 bundle task |
| `mix.rollup(input, output, inputOpt, outOpt)` | Run custom Rollup 4 bundle task |
| `mix.esbuild(entry, output, options)` | Run ultra-fast ESBuild bundle task |
| `mix.publish(input, output, rename)` | Publish assets or templates to deployment destinations |
| `mix.generateSW(options)` | Generate PWA Service Worker via Workbox |
| `mix.injectManifest(options)` | Inject precache manifest into existing Service Worker |
| `mix.zip(input, output, filename)` | Compress output files into a ZIP archive |
| `mix.ftp(localFiles, options)` | Upload build outputs to remote server via SFTP |
| `mix.serve()` | Launch local static server with proxy support |

---

## 🛠️ Development & Contributing

```bash
# Clone the repository
git clone https://github.com/balmjs/balm.git -b 6.x
cd balm

# Install dependencies
pnpm install

# Build all workspace packages
pnpm build

# Watch mode for iterative development
pnpm dev

# Run full test suite
pnpm test

# Generate changesets for release
pnpm changeset
```

---

## 📄 License

[MIT](LICENSE) © 2016-present [N.Elf-mousE](https://github.com/elf-mouse)
