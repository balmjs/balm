import Sprite from './sprite';
import Sass from './sass';
import Script from './script';
import Lint from './lint';
import Html from './html';
import Image from './image';
import Font from './font';
import Extra from './extra';
import Clean from './clean';
import Server from './server';
import Wiredep from './wiredep';
import Build from './build';

const init = () => {
  // create quick dir
  for (let rKey in config.roots) {
    config[rKey] = {};
    for (let pKey in config.paths[rKey]) {
      config[rKey][pKey] = config.roots[rKey] + config.paths[rKey][pKey];
    }
  }

  new Sprite();

  let sass = new Sass();
  let script = new Script();
  let lint = new Lint();
  let html = new Html();
  let image = new Image();
  let font = new Font();
  let extra = new Extra();
  let clean = new Clean();
  let server = new Server();
  let wiredep = new Wiredep();
  let build = new Build();

  const taskList = [
    sass,
    script,
    lint,
    html,
    image,
    font,
    extra,
    clean,
    server,
    wiredep,
    build
  ];

  for (let taskItem of taskList) {
    gulp.task(taskItem.name, taskItem.deps, taskItem.fn);
  }

  if (config.production) {
    gulp.task('default', ['clean'], () => {
      gulp.start('build');
    });
  } else {
    gulp.task('default', ['serve']);
  }
};

export default init;
