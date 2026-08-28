import fs from 'fs';
import { rimrafSync } from 'rimraf';

// https://github.com/Microsoft/TypeScript/issues/20007
interface Function {
  (...args: any[]): any;
}

interface TestObj {
  testCase: string | false | string[];
  testHook: Function;
}

interface timeoutObj {
  done: Function;
  delay?: number;
}

function cleanup() {
  rimrafSync(`${balm.config.workspace}/.output`);
  rimrafSync(`${balm.config.workspace}/.tmp`);
  rimrafSync(`${balm.config.workspace}/dist`);
  rimrafSync(`${balm.config.workspace}/assets`);
  rimrafSync(`${balm.config.workspace}/src/styles/sprites`);
  rimrafSync(`${balm.config.workspace}/archive.zip`);
  rimrafSync(`${balm.config.workspace}/new-archive.zip`);
}

function shouldExist(file: string, contents?: string) {
  const filePath = `${balm.config.workspace}/${file}`;
  let result;

  if (contents) {
    result = fs.readFileSync(filePath, { encoding: 'utf8' });
    expect(result, `File content match failed for: ${file}`).to.equal(contents);
  } else {
    result = fs.existsSync(filePath);
    expect(result, `File should exist: ${file}`).to.equal(true);
  }
}

function shouldNotExist(file: string) {
  const filePath = `${balm.config.workspace}/${file}`;
  const result = fs.existsSync(filePath);
  expect(result, `File should not exist: ${file}`).to.equal(false);
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
  timeout?: Function | timeoutObj,
  checkExist: string | boolean = true
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let doneFn: Function | undefined;
    if (typeof timeout === 'function') {
      doneFn = timeout;
    } else if (
      typeof timeout === 'object' &&
      typeof timeout.done === 'function'
    ) {
      doneFn = timeout.done;
    }

    const finish = (err?: any) => {
      if (err) {
        if (doneFn) doneFn(err);
        reject(err);
      } else {
        if (doneFn) doneFn();
        resolve();
      }
    };

    if (typeof testObj === 'object') {
      balm.afterTask = function () {
        try {
          assertCase((testObj as TestObj).testCase, checkExist);
          finish();
        } catch (err) {
          finish(err);
        }
      };

      try {
        balm.go((testObj as TestObj).testHook || function () {});
      } catch (err) {
        finish(err);
      }
    } else {
      try {
        assertCase(testObj, checkExist);
        finish();
      } catch (err) {
        finish(err);
      }
    }
  });
}

export { cleanup, runTest };
