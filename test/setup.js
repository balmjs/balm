import path from 'path';
import fs from 'fs';
import chai from 'chai';
import gulp from 'gulp';
import balm from '../lib';
import balmConfig from '../test-workspace/config/test';
import assert from 'assert';

global.path = path;
global.fs = fs;
global.should = chai.should();
global.expect = chai.expect;
global.gulp = gulp;
global.balm = balm;
global.balmConfig = balmConfig;
global.workspace = balmConfig.workspace;

global.shouldExist = (file, contents) => {
  file = `${workspace}/${file}`;

  console.log('shouldExist', file);

  let re = fs.existsSync(file);

  console.log('result:', re);

  assert.equal(re, true);

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~');

  if (contents) {
    fs.readFileSync(file, { encoding: 'utf8' }).should.eql(contents);
  }
};

global.runTask = async (task, assertions, done) => {
  await task();
  setTimeout(assertions, 20000);
  done();
};
