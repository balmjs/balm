import fs from 'fs';
import { sync as del } from 'rimraf';

function cleanup() {
  del(`${balm.config.workspace}/.tmp`);
  del(`${balm.config.workspace}/dist`);
  del(`${balm.config.workspace}/archive.zip`);
  del(`${balm.config.workspace}/new-archive.zip`);
}

function shouldExist(file: string, contents?: string) {
  const filePath = `${balm.config.workspace}/${file}`;
  let result;

  if (contents) {
    result = fs.readFileSync(filePath, { encoding: 'utf8' });
    expect(result).to.equal(contents);
  } else {
    result = fs.existsSync(filePath);
    expect(result).to.equal(true);
  }
}

export { cleanup, shouldExist };
