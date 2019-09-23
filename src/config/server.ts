import { ProxyConfig } from './types';

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
  reload: true,
  noInfo: true
};
const proxyConfig: boolean | ProxyConfig | ProxyConfig[] = false;
// Single proxy example
// {
//   context: '/api',
//   options: {
//     target: 'http://www.example.org',
//     changeOrigin: true
//   }
// }
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
const watchFiles: string[] = [];

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
  proxyConfig,
  historyOptions,
  middlewares,
  watchFiles
};
