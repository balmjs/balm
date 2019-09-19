import httpProxyMiddleware from './proxy';

function getMiddlewares(): object[] {
  const middlewares: object[] = [...httpProxyMiddleware()];

  return middlewares;
}

export default getMiddlewares;
