import fs from 'fs';
import gulp from 'gulp';
import balm from '../src';
import balmConfig from './balmrc';
import { expect } from 'chai';
import utils from '../src/utilities/utils';

const isWindows = process.platform === 'win32';

balm.config = balmConfig;

global.isWindows = isWindows;
global.balm = balm;
global.gulp = gulp;
global.expect = expect;
global.workspace = balmConfig.workspace;

function asyncCase(fn: Function) {
  return function(done: Function) {
    try {
      fn();
      done();
    } catch (err) {
      done(err);
    }
  };
}

global.asyncCase = asyncCase;

const DELAY = 4000;

function shouldExist(file: string, contents?: string) {
  let path = `${workspace}/${file}`;
  let result;

  if (contents) {
    result = fs.readFileSync(file, { encoding: 'utf8' });
    result.should.eql(contents);
  } else {
    result = fs.existsSync(path);
    result.should.be.true;
  }
}

function shouldNoExist(file: string) {
  let path = `${workspace}/${file}`;
  let result = fs.existsSync(path);
  result.should.be.false;
}

global.runTask = (
  obj: { task: any; test: any; done: Function },
  result: boolean = true
) => {
  gulp.series(utils.isObject(obj.task) ? obj.task.fn : obj.task)();

  setTimeout(
    () => {
      if (utils.isFunction(test)) {
        obj.test();
      } else {
        if (utils.isArray(test)) {
          obj.test.forEach((file: string) => {
            result ? shouldExist(file) : shouldNoExist(file);
          });
        } else {
          result ? shouldExist(obj.test) : shouldNoExist(obj.test);
        }

        obj.done();
      }
    },
    obj.task === 'default' ? DELAY * 2 : DELAY
  );
};
