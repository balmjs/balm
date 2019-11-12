import fs from 'fs';
import { sync as del } from 'rimraf';

interface TestObj {
  testCase: string | false | string[];
  testHook: Function;
}

function cleanup() {
  del(`${balm.config.workspace}/.output`);
  del(`${balm.config.workspace}/.tmp`);
  del(`${balm.config.workspace}/dist`);
  del(`${balm.config.workspace}/assets`);
  del(`${balm.config.workspace}/src/styles/sprites`);
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

function shouldNotExist(file: string) {
  const filePath = `${balm.config.workspace}/${file}`;
  const result = fs.existsSync(filePath);
  expect(result).to.equal(false);
}

function assertCase(
  testCase: string | boolean | string[],
  checkExist: string | boolean
) {
  if (testCase as boolean) {
    if (typeof checkExist === 'string') {
      const contents: string = checkExist;
      shouldExist(testCase as string, contents);
    } else {
      if (Array.isArray(testCase)) {
        (testCase as string[]).forEach((file: string) => {
          checkExist ? shouldExist(file) : shouldNotExist(file);
        });
      } else {
        checkExist
          ? shouldExist(testCase as string)
          : shouldNotExist(testCase as string);
      }
    }
  }
}

function runTest(
  testObj: string | false | string[] | TestObj,
  timeout:
    | Function
    | {
        done: Function;
        delay?: number;
      },
  checkExist: string | boolean = true
) {
  if (typeof testObj === 'object') {
    balm.afterTask = function() {
      assertCase((testObj as TestObj).testCase, checkExist);
    };

    balm.go((testObj as TestObj).testHook || function() {});

    gulp.series('default')();
  } else {
    assertCase(testObj, checkExist);
  }

  if (typeof timeout === 'object') {
    setTimeout(timeout.done, timeout.delay);
  } else if (typeof timeout === 'function') {
    setTimeout(timeout, 2000);
  }
}

export { cleanup, runTest };