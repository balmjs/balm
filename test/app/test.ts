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

async function runTest(
  testObj: string | false | string[] | TestObj,
  timeout: Function | timeoutObj,
  checkExist: string | boolean = true
) {
  if (typeof testObj === 'object') {
    balm.afterTask = function () {
      assertCase((testObj as TestObj).testCase, checkExist);
    };

    try {
      await balm.go((testObj as TestObj).testHook || function () {});

      await gulp.parallel('balm:default')();
    } catch (err) {
      if (typeof timeout === 'object') {
        setTimeout(() => {
          timeout.done(err);
        }, timeout.delay as number);
      } else {
        setTimeout(() => {
          timeout(err);
        }, 2000);
      }
    }
  } else {
    await assertCase(testObj, checkExist);
  }

  if (typeof timeout === 'object') {
    setTimeout(() => {
      timeout.done();
    }, timeout.delay as number);
  } else {
    setTimeout(() => {
      timeout();
    }, 2000);
  }
}

export { cleanup, runTest };
