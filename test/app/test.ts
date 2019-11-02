import fs from 'fs';
import { sync as del } from 'rimraf';

function cleanup(dir = '') {
  if (dir) {
    del(`${balm.config.workspace}/${dir}`);
  } else {
    del(`${balm.config.workspace}/.tmp`);
    del(`${balm.config.workspace}/dist`);
    del(`${balm.config.workspace}/archive.zip`);
    del(`${balm.config.workspace}/new-archive.zip`);
  }
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

function runTest(
  obj: {
    testCase: string | false | string[];
    hook?: Function;
  },
  timeout:
    | Function
    | {
        done: Function;
        delay?: number;
      }
) {
  balm.afterTask = function() {
    if (obj.testCase) {
      if (Array.isArray(obj.testCase)) {
        (obj.testCase as string[]).forEach((file: string) => {
          shouldExist(file);
        });
      } else {
        shouldExist(obj.testCase);
      }
    }
  };
  balm.go(obj.hook || function() {});

  gulp.series('default')();

  if (typeof timeout === 'object') {
    setTimeout(timeout.done, timeout.delay);
  } else if (typeof timeout === 'function') {
    setTimeout(timeout, 2000);
  }
}

export { cleanup, runTest };
