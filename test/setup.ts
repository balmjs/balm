import balm from '../src';
import balmConfig from './balmrc';
import { expect } from 'chai';

const isWindows = process.platform === 'win32';

balm.config = balmConfig;

global.isWindows = isWindows;
global.balm = balm;
global.expect = expect;

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
