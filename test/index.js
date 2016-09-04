import shell from 'shelljs';
import path from 'path';
import balm from '../lib/main';

const root = path.resolve(__dirname, '../');
const workspace = path.join(root, 'workspace');
const app = path.join(workspace, 'app');
const assets = path.join(workspace, 'assets');
const testConfig = {
  root: root,
  workspace: workspace,
  app: app,
  assets: assets
};

if (shell.test('-e', testConfig.workspace)) {
  shell.rm('-rf', testConfig.workspace);
}
shell.mkdir('-p', [
  testConfig.app + '/styles',
  testConfig.app + '/scripts',
  testConfig.app + '/images',
  testConfig.app + '/fonts'
]);
shell.echo('<link rel="stylesheet" href="css/main.css">\n<h1>Hello World</h1>\n<script src="js/main.js"></script>').to(testConfig.app + '/index.html');
shell.echo('* {\n\tmargin: 0;\n\tpadding: 0;\n}').to(testConfig.app + '/styles/main.scss');
shell.echo('console.log("Hello BalmJS");').to(testConfig.app + '/scripts/main.js');

// console.log('Previously on BalmJS:\n', balm.config);

balm.config = {
  test: true,
  debug: true,
  production: true,
  workspace: testConfig.workspace,
  roots: {
    source: 'app',
    target: 'dist'
  },
  paths: {
    source: {
      css: 'styles',
      js: 'scripts',
      img: 'images',
      font: 'fonts'
    },
    target: {
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font'
    }
  },
  styles: {
    ext: 'scss'
  },
  scripts: {
    entry: {
      main: './app/scripts/main.js'
    },
    eslint: true
  },
  sprites: {
    image: ['icon'],
    svg: ['icon']
  },
  cache: true,
  assets: {
    root: testConfig.assets,
    publicPath: 'public',
    subDir: 'web'
  }
};

balm.go();

balm.go(); // test singleton
