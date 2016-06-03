import { initConfig } from '../helper';
import Sprite from './sprite';
import Sass from './sass';
import Less from './less';
import Style from './style';
import Script from './script';
import Lint from './lint';
import Html from './html';
import Image from './image';
import Font from './font';
import Extra from './extra';
import Clean from './clean';
import CleanAll from './cleanall';
import Server from './server';
import Wiredep from './wiredep';
import Build from './build';

const init = () => {
  initConfig();

  let sprite = new Sprite();
  let css;
  switch (config.styles.ext) {
    case 'sass':
    case 'scss':
      css = new Sass();
      break;
    case 'less':
      css = new Less();
      break;
    default:
      // css = new Css();
      break;
  }
  let style = new Style();
  let script = new Script();
  let lint = new Lint();
  let html = new Html();
  let image = new Image();
  let font = new Font();
  let extra = new Extra();
  let clean = new Clean();
  let cleanAll = new CleanAll();
  let server = new Server();
  let wiredep = new Wiredep();
  let build = new Build();

  const taskList = [
    sprite,
    css,
    style,
    script,
    lint,
    html,
    image,
    font,
    extra,
    clean,
    cleanAll,
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
