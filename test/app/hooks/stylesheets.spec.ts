import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - css & sprites', function() {
  after(function() {
    cleanup();
  });

  describe('stylesheets', function() {
    before(function() {
      balm.config = {
        useDefaults: false
      };
    });

    ['css', 'sass', 'less'].forEach(extname => {
      const api = extname;
      const input = `src/styles/main.${extname === 'sass' ? 'scss' : extname}`;
      const output = `${targetDir}/${extname}`;

      it(`compiles ${
        extname === 'css' ? 'postcss' : extname
      } files to the "${output}" directory`, function(done) {
        runTest(
          {
            testCase: `${output}/main.css`,
            testHook: (mix: any) => {
              mix[api](input, output);
            }
          },
          done
        );
      });
    });
  });

  describe('url processing', function() {
    before(function() {
      balm.config = {
        useDefaults: false
      };
    });

    const input = 'src/styles/main.css';
    const output = `${targetDir}/url`;
    const contents = isWindows
      ? "@import 'global/_index.css';\r\n\r\n@font-face {\r\n  font-family: Roboto;\r\n  font-weight: 400;\r\n  font-style: normal;\r\n  src: local('Roboto'), local('Roboto-Regular'),\r\n    url('../font/roboto-regular.woff') format('woff');\r\n}\r\n\r\n* {\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\nbody {\r\n  font-family: Roboto, Arial;\r\n  color: var(--primaryColor);\r\n}\r\n\r\nimg {\r\n  width: 64px;\r\n  height: 64px;\r\n}\r\n\r\n#app {\r\n  & a,\r\n  & img,\r\n  & span {\r\n    vertical-align: middle;\r\n  }\r\n}\r\n\r\n.logo {\r\n  background: url('../img/logo.svg');\r\n}\r\n\r\n.test {\r\n  @supports (pointer-events: auto) {\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n    opacity: 0;\r\n    transition-property: opacity;\r\n    visibility: visible;\r\n    pointer-events: none;\r\n\r\n    &.is-visible {\r\n      pointer-events: auto;\r\n      opacity: 1;\r\n    }\r\n  }\r\n}\r\n"
      : "@import 'global/_index.css';\n\n@font-face {\n  font-family: Roboto;\n  font-weight: 400;\n  font-style: normal;\n  src: local('Roboto'), local('Roboto-Regular'),\n    url('../font/roboto-regular.woff') format('woff');\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: Roboto, Arial;\n  color: var(--primaryColor);\n}\n\nimg {\n  width: 64px;\n  height: 64px;\n}\n\n#app {\n  & a,\n  & img,\n  & span {\n    vertical-align: middle;\n  }\n}\n\n.logo {\n  background: url('../img/logo.svg');\n}\n\n.test {\n  @supports (pointer-events: auto) {\n    background-color: rgba(0, 0, 0, 0.5);\n    opacity: 0;\n    transition-property: opacity;\n    visibility: visible;\n    pointer-events: none;\n\n    &.is-visible {\n      pointer-events: auto;\n      opacity: 1;\n    }\n  }\n}\n";

    it('expected output: `images` => `img` & `fonts` => `font`', function(done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          testHook: (mix: any) => {
            mix.url(input, output);
          }
        },
        done,
        contents
      );
    });
  });

  describe('css sprites', function() {
    describe('has sprites', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          },
          useDefaults: false
        };
      });

      const input = ['icons', 'mdi'];
      const output = `${targetDir}/images`;

      it('#mix.sprite()', function(done) {
        runTest(
          {
            testCase: false,
            testHook: (mix: any) => {
              mix.sprite(input, output);
            }
          },
          {
            done,
            delay: 4000
          }
        );
      });

      it('expected output: true', function(done) {
        const testCase = [
          `${output}/icons-sprites.png`,
          `${output}/mdi-sprites.png`,
          'src/styles/sprites/_icons.css',
          'src/styles/sprites/_mdi.css'
        ];

        runTest(testCase, done);
      });
    });

    describe('no sprites', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          },
          useDefaults: false
        };
      });

      const input: string[] = [];
      const output = `${targetDir}/images`;

      it('expected output: false', function(done) {
        runTest(
          {
            testCase: false,
            testHook: (mix: any) => {
              mix.sprite(input, output);
            }
          },
          done,
          false
        );
      });
    });
  });
});
