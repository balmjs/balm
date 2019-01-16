import path from 'path';
import fs from 'fs';
import chai from 'chai';
import gulp from 'gulp';
import balm from '../lib';
import balmConfig from '../test-workspace/config/test';

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

  fs.existsSync(file).should.be.true;

  if (contents) {
    fs.readFileSync(file, { encoding: 'utf8' }).should.eql(contents);
  }
};

global.runTask = (task, assertions, done) => {
  task();
  setTimeout(() => {
    assertions();
    done();
  }, 1000);
};
