import { runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - ftp', function() {
  before(function() {
    balm.config = {
      useDefaults: false
    };
  });

  it('#mix.ftp()', function(done) {
    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.ftp(
            'ftp/**/*',
            {
              host: '',
              username: '',
              password: '',
              remotePath: '/var/www/balm-ftp-test'
            },
            {
              base: ''
            }
          );
        }
      },
      done
    );
  });
});
