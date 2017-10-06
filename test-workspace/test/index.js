import balm from '../../lib/main';
import balmConfig from '../balmrc';
import gulp from 'gulp';
import chai from 'chai';
import remove from 'rimraf';

global.path = require('path');
global.fs = require('fs');
global.should = chai.should();
global.expect = chai.expect;

global.shouldExist = (file, contents) => {
  fs.existsSync(file).should.be.true;

  if (contents) {
    fs.readFileSync(file, {encoding: 'utf8'}).should.eql(contents);
  }
};

balm.config = balmConfig;
global.balm = balm;
global.workspace = balmConfig.workspace;
global.appDir = path.join(workspace, balmConfig.roots.source);

global.runGulp = assertions => {
  gulp.start('default', () => {
    assertions();

    remove.sync(`${workspace}/copy-dest`);
    remove.sync(`${workspace}/.tmp`);
    remove.sync(`${workspace}/.compile`);
    remove.sync(`${workspace}/dist`);
    remove.sync(`${workspace}/assets`);
    remove.sync(`${workspace}/archive.zip`);
  });
};
