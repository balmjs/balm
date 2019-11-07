import FtpTask from '../../../src/tasks/public/ftp';

describe('Ftp Task', function() {
  let ftpTask: any;

  beforeEach(function() {
    ftpTask = new FtpTask();
  });

  describe('default', function() {
    const defaultInput = undefined;

    it(
      `expected output: ${defaultInput}`,
      asyncCase(function() {
        ftpTask.fn();

        expect(ftpTask.input).to.equal(defaultInput);
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

          expect(ftpTask.input).to.equal(defaultInput);
        })
      );
    });

    describe('options', function() {
      const defaultOptions = {};
      const ftpOptions = {
        username: 'hello',
        password: 'BalmJS'
      };
      const gulpSrcOptions = {
        base: '/var/www'
      };

      it(
        `expected output: "${JSON.stringify(
          Object.assign(defaultOptions, ftpOptions)
        )}"`,
        asyncCase(function() {
          ftpTask.recipe(defaultInput, ftpOptions, gulpSrcOptions)();

          expect(JSON.stringify(ftpTask.options)).to.equal(
            JSON.stringify(Object.assign(defaultOptions, ftpOptions))
          );
          expect(JSON.stringify(ftpTask.gulpSrcOptions)).to.equal(
            JSON.stringify(gulpSrcOptions)
          );
        })
      );
    });
  });
});
