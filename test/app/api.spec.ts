import { cleanup, runTest } from './test';

const targetDir = '.output';

describe('Balm Hooks', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  describe('stylesheets', function() {
    afterEach(function() {
      cleanup(targetDir);
    });

    ['sass', 'less', 'css'].forEach(extname => {
      const api = extname;
      const input = `src/styles/main.${extname === 'sass' ? 'scss' : extname}`;
      const output = `${targetDir}/${extname}`;

      it(api, function(done) {
        runTest(
          {
            testCase: `${output}/main.css`,
            hook: function(mix: any) {
              mix[api](input, output);
            }
          },
          done
        );
      });
    });
  });

  // describe('javascript', function() {
  //   it('js', function(done) {
  //     runTest(
  //       {
  //         testCase: false,
  //         hook: function(mix: any) {
  //           mix.js('./src/scripts/main.js', `${targetDir}/js`);
  //         }
  //       },
  //       {
  //         done,
  //         delay: 4000
  //       }
  //     );
  //   });
  // });

  describe('files & directories', function() {
    it('copies a file to a new location', function(done) {
      const input = 'src/copy/foo/foo.txt';
      const output = `${targetDir}/copy-dest`;

      runTest(
        {
          testCase: `${output}/foo.txt`,
          hook: function(mix: any) {
            mix.copy(input, output);
          }
        },
        done
      );
    });

    it('copies and renames a file to a new location', function(done) {
      const input = 'src/copy/foo/foo.txt';
      const output = `${targetDir}/copy-dest`;
      const renameOptions = {
        basename: 'changed'
      };

      runTest(
        {
          testCase: `${output}/changed.txt`,
          hook: function(mix: any) {
            mix.copy(input, output, {
              renameOptions
            });
          }
        },
        done
      );
    });

    it('copies an array of folder paths to a new location', function(done) {
      const input = ['./src/copy/foo/*', './src/copy/bar/*'];
      const output = `${targetDir}/copy-dest/foobar`;

      runTest(
        {
          testCase: [`${output}/foo.txt`, `${output}/bar.txt`],
          hook: function(mix: any) {
            mix.copy(input, output);
          }
        },
        done
      );
    });

    it('copies a folder with a period in its name to a new location', function(done) {
      const input = './src/copy/foo.bar/*';
      const output = `${targetDir}/copy-dest/some.dir`;

      runTest(
        {
          testCase: `${output}/baz.txt`,
          hook: function(mix: any) {
            mix.copy(input, output);
          }
        },
        done
      );
    });
  });

  // describe('cache', function() {});

  // describe('server', function() {});

  // describe('html', function() {});
});
