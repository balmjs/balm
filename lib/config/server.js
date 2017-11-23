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
  proxyTable: {
    // '/api': {
    //   target: 'http://your.project.dev', // target host
    //   changeOrigin: true // needed for virtual hosted sites
    // }
  },
  reloadDelay: 0,
  localOnly: false, // Support environments where dynamic hostnames are not required (ie: electron)
  historyApiFallback: false,
  options: {}
};

export default SERVER_CONFIG;
