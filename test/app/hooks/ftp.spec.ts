import { runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - ftp', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  it('#mix.ftp()', function(done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.ftp('ftp/**/*', {
            ftpOptions: {
              host: '',
              username: '',
              password: '',
              remotePath: '/var/www/balm-ftp-test'
            },
            gulpSrcOptions: {
              base: ''
            }
          });
        }
      },
      done
    );
  });
});
