import ZipTask from '../../../packages/balm-core/src/tasks/public/zip';

describe('Zip Task', function() {
  let zipTask: any;

  beforeEach(function() {
    zipTask = new ZipTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      zipTask.fn(done);
    });
  });

  describe('#mix.zip()', function() {
    const defaultInput = 'dist/**/*';
    const defaultOutput = '.';

    describe('!options', function() {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function() {
          zipTask.recipe(defaultInput, defaultOutput)();

          expect(zipTask.input).to.equal(defaultInput);
          expect(zipTask.output).to.equal(defaultOutput);
        })
      );
    });

    describe('custom filename', function() {
      const filename = 'new-archive.zip';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          zipTask.recipe(defaultInput, defaultOutput, filename)();
        })
      );
    });
  });
});
