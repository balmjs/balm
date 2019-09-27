interface FtpConfig {
  host: string | undefined;
  port?: number;
  username?: string;
  password?: string | null;
  remotePath?: string;
}

const options: FtpConfig = {
  host: undefined
};
const files: string[] = [];

export default {
  options,
  files
};
