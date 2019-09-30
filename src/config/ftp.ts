interface FtpConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  remotePath?: string;
}

const options: FtpConfig = {};
const files: string[] = [];

export default {
  options,
  files
};
