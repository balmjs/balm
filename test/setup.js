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

const shouldExist = (file, contents) => {
  let path = `${workspace}/${file}`;
  let result;

  if (contents) {
    result = fs.readFileSync(file, { encoding: 'utf8' });
    result.should.eql(contents);
  } else {
    result = fs.existsSync(path);
    result.should.be.true;
  }
};

const shouldNoExist = file => {
  let path = `${workspace}/${file}`;
  let result = fs.existsSync(path);
  result.should.be.false;
};

global.runTask = ({ task, test, done }, result = true) => {
  gulp.series(task.fn || task)();

  setTimeout(() => {
    if (Array.isArray(test)) {
      test.forEach(file => {
        result ? shouldExist(file) : shouldNoExist(file);
      });
    } else {
      result ? shouldExist(test) : shouldNoExist(test);
    }

    done();
  }, 1500);
};
