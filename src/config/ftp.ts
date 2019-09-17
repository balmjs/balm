const options: object = {
  host: undefined, // Required
  port: 22,
  username: 'anonymous',
  password: null,
  remotePath: '/',
  logging: false
};
const watchFiles: string[] = [];

export default {
  options,
  watchFiles
};
