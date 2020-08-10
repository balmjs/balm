import FtpTask from '../../../packages/balm-core/src/tasks/public/ftp';

describe('Ftp Task', function() {
  let ftpTask: any;

  beforeEach(function() {
    ftpTask = new FtpTask();
  });

  describe('default', function() {
    const defaultInput = undefined;

    it(
      `expected output: "Invalid local files"`,
      asyncCase(function() {
        ftpTask.fn();
      })
    );
  });

  describe('#mix.ftp()', function() {
    const defaultInput = 'dist/*';

    describe('!options', function() {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function() {
          ftpTask.recipe(defaultInput)();

          expect(ftpTask.input).to.equal(path.join(balm.config.workspace, defaultInput));
        })
      );
    });

    describe('options', function() {
      const defaultOptions = {};
      const ftp = {
        username: 'hello',
        password: 'BalmJS'
      };
      const src = {
        base: '/var/www'
      };

      it(
        `expected output: "${JSON.stringify(
          Object.assign(defaultOptions, ftp)
        )}"`,
        asyncCase(function() {
          ftpTask.recipe(defaultInput, {
            src,
            ftp
          })();

          expect(JSON.stringify(ftpTask.options)).to.equal(
            JSON.stringify(Object.assign(defaultOptions, ftp))
          );
          expect(JSON.stringify(ftpTask.gulpSrcOptions)).to.equal(
            JSON.stringify(src)
          );
        })
      );
    });
  });
});
