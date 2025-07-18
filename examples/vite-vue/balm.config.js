/**
 * BalmJS 4.0 Vite + Vue Example
 * 展示 Vite 与 Vue 的集成配置
 */

export default {
  // 使用 Vite 作为构建工具
  bundler: 'vite',
  
  // 目标框架
  framework: 'vue',
  
  // 构建模式
  mode: process.env.NODE_ENV || 'development',
  
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
    
    // API 代理
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  
  // 编译器配置
  compiler: {
    primary: 'swc', // 使用 SWC 提升性能
    target: 'es2020',
    typescript: true
  },
  
  // CSS 配置
  css: {
    preprocessor: 'scss',
    
    // PostCSS 配置
    postcss: {
      plugins: [
        'autoprefixer'
      ]
    }
  },
  
  // Vite 特定配置
  vite: {
    // Vue 插件会自动添加
    plugins: [],
    
    // 依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia']
    },
    
    // 构建配置
    build: {
      target: 'es2015',
      
      // 代码分割
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'ui-vendor': ['element-plus'],
            'utils-vendor': ['lodash', 'axios']
          }
        }
      }
    },
    
    // 服务器配置
    server: {
      hmr: {
        overlay: true
      }
    }
  },
  
  // 资源优化
  assets: {
    images: {
      optimize: true,
      formats: ['webp'],
      quality: 80
    }
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
      title: 'BalmJS 4.0 Vite + Vue Example',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
        description: 'Modern Vue app built with BalmJS and Vite'
      }
    },
    
    // 环境变量插件
    env: {
      include: ['VITE_*']
    },
    
    // 复制静态资源
    copy: [
      { from: 'public/favicon.ico', to: 'favicon.ico' }
    ]
  },
  
  // 源码映射
  sourceMaps: {
    enabled: true,
    type: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
  },
  
  // 代码检查
  lint: {
    eslint: {
      enabled: true,
      configFile: '.eslintrc.js'
    }
  }
};