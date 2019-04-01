const SERVER_CONFIG = {
  open: true,
  browser: 'default',
  logLevel: 'info',
  https: undefined,
  host: null,
  port: 3000,
  proxy: undefined, // Host: your.project.local
  serveStatic: [
    // {
    //     route: '/public',
    //     dir: '/path/to/public'
    // }
  ],
  reloadDelay: 0,
  localOnly: false, // Support environments where dynamic hostnames are not required (ie: electron)
  options: {},
  // Middleware
  devOptions: {
    stats: false
  },
  hotOptions: {
    path: '/__balm_hmr',
    reload: true,
    noInfo: true
  },
  proxyContext: false,
  proxyOptions: false,
  // Single proxy options example
  // {
  //   target: 'http://www.example.org', // Target host
  //   changeOrigin: true, // Needed for virtual hosted sites
  //   pathRewrite: {
  //     '^/api/old-path': '/api/new-path', // Rewrite path
  //     '^/api/remove/path': '/path' // Remove base path
  //   },
  //   router: {
  //     // When request.headers.host == 'dev.localhost:3000',
  //     // override target 'http://www.example.org' to 'http://localhost:8000'
  //     'dev.localhost:3000': 'http://localhost:8000'
  //   }
  // }
  proxyConfig: [],
  // Multiple proxies example
  // [{
  //    context: '/api',
  //    options: {
  //      target: 'http://www.example.org',
  //      changeOrigin: true
  //    }
  // }, {
  //    context: ['/api2', '/api3'],
  //    options: {
  //      target: 'http://www.example2.org',
  //      changeOrigin: true
  //    }
  // }]
  historyOptions: false,
  middlewares: []
};

export default SERVER_CONFIG;
