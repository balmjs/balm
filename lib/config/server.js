const SERVER_CONFIG = {
  open: true,
  browser: true,
  host: null,
  port: 3000,
  proxy: undefined, // Host: your.project.local
  proxyTable: {
    // '/api': {
    //   target: 'http://your.project.dev', // target host
    //   changeOrigin: true // needed for virtual hosted sites
    // }
  },
  localOnly: false, // Support environments where dynamic hostnames are not required (ie: electron)
  historyApiFallback: false,
  https: false
};

export default SERVER_CONFIG;
