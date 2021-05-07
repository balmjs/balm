import fs from 'node:fs';

const balmCorePkg: {
  version: string;
} = JSON.parse(
  fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
);

export default balmCorePkg.version;
