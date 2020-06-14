import balm from '../src';
import { expect } from 'chai';

const isWin = process.platform === 'win32';

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

global.isWin = isWin;
global.balm = balm;
global.expect = expect;
global.asyncCase = asyncCase;
