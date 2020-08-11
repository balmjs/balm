import { runTest } from '../test';

describe('Balm Hooks - ftp', function() {
  before(function() {
    balm.config = {
      useDefaults: false
    };
  });

  it('#mix.ftp()', function(done) {
    const src = {
      base: ''
    };
    const ftp = {
      host: '',
      username: '',
      password: '',
      remotePath: '/var/www/balm-ftp-test'
    };

    runTest(
      {
        testCase: false,
        testHook: (mix: any) => {
          mix.ftp('ftp/**/*', {
            src,
            ftp
          });
        }
      },
      done
    );
  });
});
