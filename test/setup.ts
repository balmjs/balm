import path from 'path';
import balm from '../packages/balm-core/src/index';
import { expect } from 'chai';

const isWin = process.platform === 'win32';

const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');

balm.config = {
  workspace
};

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
