/**
 * BalmJS 4.0 Basic Webpack Example
 * 展示基本的 Webpack 配置和现代化特性
 */

export default {
  // 构建模式
  mode: process.env.NODE_ENV || 'development',
  
  // 使用 Webpack 作为打包器
  bundler: 'webpack',
  
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
    
    // API 代理示例
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
    primary: 'babel',
    target: 'es2020',
    jsx: false,
    typescript: false,
    
    // Babel 配置
    babel: {
      presets: [
        ['@babel/preset-env', {
          useBuiltIns: 'usage',
          corejs: 3
        }]
      ]
    }
  },
  
  // CSS 配置
  css: {
    preprocessor: 'scss',
    extract: true,
    
    // PostCSS 配置
    postcss: {
      plugins: [
        'autoprefixer'
      ]
    }
  },
  
  // 资源优化
  assets: {
    images: {
      optimize: true,
      formats: ['webp'],
      quality: {
        webp: 80
      }
    }
  },
  
  // 构建优化
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  
  // 插件配置
  plugins: {
    html: {
      template: 'public/index.html',
      title: 'BalmJS 4.0 Basic Example',
      minify: true
    },
    
    copy: [
      { from: 'public/favicon.ico', to: 'favicon.ico' }
    ]
  }
};