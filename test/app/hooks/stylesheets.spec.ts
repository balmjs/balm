import { cleanup, runTest } from '../test';

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
      const output = `.output/${extname}`;

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

  describe('css sprites', function() {
    // TODO: has bug
    // describe('has sprites', function() {
    //   before(function() {
    //     balm.config = {
    //       env: {
    //         isDev: true
    //       },
    //       styles: {
    //         sprites: ['icons', 'mdi']
    //       },
    //       useDefaults: false
    //     };
    //   });

    //   it('expected output: true', function(done) {
    //     const output = [
    //       '.tmp/img/icons-sprites.png',
    //       '.tmp/img/mdi-sprites.png',
    //       'src/styles/sprites/_icons.css',
    //       'src/styles/sprites/_mdi.css'
    //     ];

    //     runTest(
    //       {
    //         testCase: output,
    //         testHook: (mix: any) => {
    //           mix.sprite();
    //         }
    //       },
    //       done
    //     );
    //   });
    // });

    describe('no sprites', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          },
          useDefaults: false
        };
      });

      it('expected output: false', function(done) {
        runTest(
          {
            testCase: false,
            testHook: (mix: any) => {
              mix.sprite();
            }
          },
          done,
          false
        );
      });
    });
  });
});
