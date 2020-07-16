import ScriptTask from '../../../packages/balm-core/src/tasks/public/script';

describe('Script Task', function() {
  let scriptTask: any;

  beforeEach(function() {
    scriptTask = new ScriptTask();
  });

  describe('default', function() {
    before(function() {
      balm.config = {
        scripts: {
          entry: './src/scripts/index.js'
        }
      };
    });

    const defaultInput = './src/scripts/index.js';

    it(`expected output: "${defaultInput}"`, function(done) {
      scriptTask.fn(done);

      expect(scriptTask.input).to.equal(defaultInput);
    });
  });

  describe('#mix.js()', function() {
    before(function() {
      balm.config = {
        logs: {
          level: 2
        }
      };
    });

    const defaultInput = './src/scripts/index.js';
    const defaultOutput = 'dist/js';

    it(`expected output: "${defaultInput}"`, function(done) {
      scriptTask.recipe(defaultInput, defaultOutput, {})(done);

      expect(scriptTask.input).to.equal(defaultInput);
      expect(scriptTask.output).to.equal(defaultOutput);
    });
  });

  describe('use esbuild', function() {
    const defaultInput: string[] = [];

    before(function() {
      balm.config = {
        scripts: {
          esbuild: true
        }
      };
    });

    it(`expected output: "${defaultInput}"`, function(done) {
      scriptTask.fn(done);

      expect(JSON.stringify(scriptTask.input)).to.equal(
        JSON.stringify(defaultInput)
      );
    });
  });

  describe('use esbuild #mix.js()', function() {
    before(function() {
      balm.config = {
        scripts: {
          esbuild: true
        }
      };
    });

    const defaultInput = 'src/scripts/index.js';
    const defaultOutput = 'dist/js';

    it(`expected output: "${defaultInput}"`, function(done) {
      scriptTask.recipe(defaultInput, defaultOutput, {})(done);

      expect(scriptTask.input).to.equal(defaultInput);
      expect(scriptTask.output).to.equal(defaultOutput);
    });
  });
});
