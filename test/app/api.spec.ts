import { cleanup, runTest } from './test';

const targetDir = '.manual';

describe('balm hooks', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  describe('stylesheets', function() {
    afterEach(function() {
      // cleanup(targetDir);
    });

    ['sass', 'less', 'css'].forEach(extname => {
      const api = extname;
      it(api, function(done) {
        runTest(
          {
            testCase: `${targetDir}/${extname}/main.css`,
            hook: function(mix: any) {
              mix[api](
                `src/styles/main.${extname === 'sass' ? 'scss' : extname}`,
                `${targetDir}/${extname}`
              );
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

  // describe('files & directories', function() {});

  // describe('cache', function() {});

  // describe('server', function() {});

  // describe('html', function() {});
});
