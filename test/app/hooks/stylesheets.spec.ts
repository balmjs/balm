import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - css & sprites', function () {
  after(function () {
    cleanup();
  });

  describe('compiles sass', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    const input = `src/styles/main.scss`;
    const output = `${targetDir}/sass`;

    it(`expected output: ${output}`, function (done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          testHook: (mix: any) => {
            mix.sass(input, output);
          }
        },
        done
      );
    });
  });

  describe('compiles less', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    const input = `src/styles/main.less`;
    const output = `${targetDir}/less`;

    it(`expected output: ${output}`, function (done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          testHook: (mix: any) => {
            mix.less(input, output);
          }
        },
        done
      );
    });
  });

  describe('compiles postcss', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    const input = `src/styles/main.css`;
    const output = `${targetDir}/css`;

    it(`expected output: ${output}`, function (done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          testHook: (mix: any) => {
            mix.css(input, output);
          }
        },
        done
      );
    });
  });

  describe('url processing', function () {
    before(function () {
      balm.config = {
        useDefaults: false
      };
    });

    const input = 'src/styles/main.css';
    const output = `${targetDir}/url`;
    const contents = `@import \'global/_index.css\';\n\n@font-face {\n  font-family: Roboto;\n  font-weight: 400;\n  font-style: normal;\n  src: local(\'Roboto\'), local(\'Roboto-Regular\'),\n    url(\'../font/roboto-regular.woff\') format(\'woff\');\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: Roboto, Arial;\n  color: var(--primaryColor);\n}\n\nimg {\n  width: 64px;\n  height: 64px;\n}\n\nvideo {\n  max-width: 100%;\n}\n\n#app {\n  & a,\n  & img,\n  & span {\n    vertical-align: middle;\n  }\n}\n\n.logo {\n  background: url(\'../img/logo.svg\');\n}\n\n.test {\n  @supports (pointer-events: auto) {\n    background-color: rgba(0, 0, 0, 0.5);\n    opacity: 0;\n    transition-property: opacity;\n    visibility: visible;\n    pointer-events: none;\n\n    &.is-visible {\n      pointer-events: auto;\n      opacity: 1;\n    }\n  }\n}\n`;

    it('expected output: `images` => `img` & `fonts` => `font`', function (done) {
      runTest(
        {
          testCase: `${output}/main.css`,
          testHook: (mix: any) => {
            mix.url(input, output);
          }
        },
        done,
        isWin ? true : contents
      );
    });
  });

  describe('css sprites', function () {
    beforeEach(function () {
      balm.config = {
        env: {
          isDev: true
        },
        useDefaults: false
      };
    });

    describe('has sprites', function () {
      const input = ['icons', 'mdi'];
      const output = `${targetDir}/images`;

      it('#mix.sprite()', function (done) {
        runTest(
          {
            testCase: false,
            testHook: (mix: any) => {
              mix.sprite(input, output);
            }
          },
          done
        );
      });

      it('expected output: true', function (done) {
        const testCase = [
          `${output}/icons-sprites.png`,
          `${output}/mdi-sprites.png`,
          'src/styles/sprites/_icons.css',
          'src/styles/sprites/_mdi.css'
        ];

        runTest(testCase, done);
      });
    });

    describe('no sprites', function () {
      before(function () {
        balm.config = {
          env: {
            isDev: true
          },
          useDefaults: false
        };
      });

      const input: string[] = [];
      const output = `${targetDir}/images`;

      it('expected output: false', function (done) {
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
