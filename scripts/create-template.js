#!/usr/bin/env node

/**
 * BalmJS 4.0 项目模板生成器
 * 用于快速创建不同类型的 BalmJS 项目
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 模板配置
const templates = {
    'basic-webpack': {
        name: 'Basic Webpack Project',
        description: '基础的 Webpack 项目模板',
        bundler: 'webpack',
        compiler: 'babel',
        framework: null,
        typescript: false
    },
    'typescript-react': {
        name: 'TypeScript + React Project',
        description: 'TypeScript + React 项目模板',
        bundler: 'vite',
        compiler: 'swc',
        framework: 'react',
        typescript: true
    },
    'vite-vue': {
        name: 'Vite + Vue Project',
        description: 'Vite + Vue 项目模板',
        bundler: 'vite',
        compiler: 'swc',
        framework: 'vue',
        typescript: true
    }
};

// 生成配置文件
function generateConfig(template, projectName) {
    const config = templates[template];

    const configContent = `/**
 * ${projectName} - BalmJS 4.0 Configuration
 * Generated from ${config.name} template
 */

export default {
  // 构建模式
  mode: process.env.NODE_ENV || 'development',
  
  // 打包器选择
  bundler: '${config.bundler}',
  
  ${config.framework ? `// 目标框架
  framework: '${config.framework}',
  ` : ''}
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
    open: true
  },
  
  // 编译器配置
  compiler: {
    primary: '${config.compiler}',
    target: 'es2020'${config.typescript ? ',\n    typescript: true' : ''}
  },
  
  // CSS 配置
  css: {
    preprocessor: 'scss'
  },
  
  // 构建优化
  optimization: {
    minimize: true,
    treeShaking: true
  },
  
  // 插件配置
  plugins: {
    html: {
      template: 'public/index.html',
      title: '${projectName}'
    }
  }
};`;

    return configContent;
}

// 生成 package.json
function generatePackageJson(template, projectName) {
    const config = templates[template];

    const packageJson = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: `${projectName} - Built with BalmJS 4.0`,
        type: 'module',
        scripts: {
            dev: 'balm dev',
            build: 'balm build',
            preview: 'balm preview'
        },
        dependencies: {
            balm: '^4.0.0'
        },
        devDependencies: {},
        engines: {
            node: '>=16.0.0'
        }
    };

    // 添加框架依赖
    if (config.framework === 'react') {
        packageJson.dependencies.react = '^18.2.0';
        packageJson.dependencies['react-dom'] = '^18.2.0';
        packageJson.devDependencies['@vitejs/plugin-react'] = '^4.0.0';
    } else if (config.framework === 'vue') {
        packageJson.dependencies.vue = '^3.3.0';
        packageJson.devDependencies['@vitejs/plugin-vue'] = '^4.2.0';
    }

    // 添加 TypeScript 依赖
    if (config.typescript) {
        packageJson.devDependencies.typescript = '^5.1.0';
        packageJson.devDependencies['@types/node'] = '^20.0.0';

        if (config.framework === 'react') {
            packageJson.devDependencies['@types/react'] = '^18.2.0';
            packageJson.devDependencies['@types/react-dom'] = '^18.2.0';
        }
    }

    // 添加编译器依赖
    if (config.compiler === 'babel') {
        packageJson.devDependencies['@babel/core'] = '^7.22.0';
        packageJson.devDependencies['@babel/preset-env'] = '^7.22.0';
    } else if (config.compiler === 'swc') {
        packageJson.devDependencies['@swc/core'] = '^1.3.0';
    }

    // 添加样式依赖
    packageJson.devDependencies.sass = '^1.63.0';
    packageJson.devDependencies.autoprefixer = '^10.4.0';

    return JSON.stringify(packageJson, null, 2);
}

// 主函数
function createProject() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node create-template.js <template> <project-name>');
        console.log('\nAvailable templates:');
        Object.keys(templates).forEach(key => {
            console.log(`  ${key} - ${templates[key].description}`);
        });
        process.exit(1);
    }

    const [template, projectName] = args;

    if (!templates[template]) {
        console.error(`Template "${template}" not found!`);
        console.log('\nAvailable templates:');
        Object.keys(templates).forEach(key => {
            console.log(`  ${key} - ${templates[key].description}`);
        });
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(`Directory "${projectName}" already exists!`);
        process.exit(1);
    }

    console.log(`Creating ${templates[template].name}...`);
    console.log(`Project: ${projectName}`);
    console.log(`Path: ${projectPath}`);

    // 创建项目目录
    fs.mkdirSync(projectPath, { recursive: true });

    // 生成配置文件
    const configContent = generateConfig(template, projectName);
    const configFile = templates[template].typescript ? 'balm.config.ts' : 'balm.config.js';
    fs.writeFileSync(path.join(projectPath, configFile), configContent);

    // 生成 package.json
    const packageJsonContent = generatePackageJson(template, projectName);
    fs.writeFileSync(path.join(projectPath, 'package.json'), packageJsonContent);

    console.log('\n✅ Project created successfully!');
    console.log('\nNext steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  npm run dev');
    console.log('\nHappy coding! 🚀');
}

// 运行脚本
if (require.main === module) {
    createProject();
}

module.exports = { createProject, templates };