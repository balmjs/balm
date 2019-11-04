import VersionTask from '../../../src/tasks/public/version';

describe('Version Task', function() {
  let versionTask: any;

  beforeEach(function() {
    versionTask = new VersionTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      versionTask.fn(done);
    });
  });

  describe('#mix.jsmin()', function() {
    const defaultInput = 'src/main.js';
    const defaultOutput = 'dist';

    describe('!options', function() {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function() {
          versionTask.recipe(defaultInput, defaultOutput)();

          expect(versionTask.input).to.equal(defaultInput);
          expect(versionTask.output).to.equal(defaultOutput);
        })
      );
    });

    describe('options', function() {
      const defaultOptions = {
        fileNameManifest: 'rev-manifest.json',
        dontRenameFile: ['.html', '.php'],
        dontUpdateReference: ['.html', '.php']
      };
      const customOptions = {
        fileNameManifest: 'new-manifest.json'
      };

      it(
        `expected output: "${JSON.stringify(
          Object.assign(defaultOptions, customOptions)
        )}"`,
        asyncCase(function() {
          versionTask.recipe(defaultInput, defaultOutput, {
            assetsOptions: customOptions
          })();

          expect(JSON.stringify(versionTask.options)).to.equal(
            JSON.stringify(Object.assign(defaultOptions, customOptions))
          );
        })
      );
    });
  });
});
