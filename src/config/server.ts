const port = 3000;
const host: string | null = null;
const https: boolean | undefined = undefined;
const open: string | boolean = false;
const localOnly = false; // Support environments where dynamic hostnames are not required (ie: electron)
const proxy: string | boolean | object = false; // Host: your.project.dev
const serveStatic: string[] = [
  // {
  //     route: '/public',
  //     dir: '/path/to/public'
  // }
];
const options: any = {};
// Middleware
const devOptions: any = {
  stats: false
};
const hotOptions: any = {
  path: '/__balm_hmr',
  reload: true,
  noInfo: true
};
const proxyContext = false;
const proxyOptions = false;
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
const proxyConfig: object[] = [];
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
const historyOptions: boolean | object = false;
const middlewares: object[] = [];

export default {
  port,
  host,
  https,
  open,
  localOnly,
  proxy,
  serveStatic,
  options,
  devOptions,
  hotOptions,
  proxyContext,
  proxyOptions,
  proxyConfig,
  historyOptions,
  middlewares
};
