interface FtpConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  remotePath?: string;
}

const options: FtpConfig = {};
const watchFiles: string[] = [];

export default {
  options,
  watchFiles
};
