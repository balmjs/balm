const FTP_CONFIG = {
  options: {
    host: undefined, // Required
    port: 22,
    username: 'anonymous',
    password: null,
    remotePath: '/',
    logging: false
  },
  watchFiles: []
};

export default FTP_CONFIG;
