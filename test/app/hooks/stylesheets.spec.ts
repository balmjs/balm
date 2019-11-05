import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - stylesheets', function() {
  beforeEach(function() {
    balm.config = {
      env: {
        isDev: true
      },
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
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

  // describe('css sprites', function() {
  //   it('expected output: xxx', function(done) {
  //     const input = ['icons', 'mdi'];
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
  //           mix.sprite(input);
  //         }
  //       },
  //       done
  //     );
  //   });
  // });
});
