import EsbuildTask from '../../../packages/balm-core/src/tasks/public/esbuild';

describe('Esbuild Task', function() {
  let esbuildTask: any;

  beforeEach(function() {
    esbuildTask = new EsbuildTask();
  });

  describe('use esbuild with default entry', function() {
    const defaultInput = './src/scripts/index.js';

    before(function() {
      balm.config = {
        scripts: {
          bundler: 'esbuild'
        }
      };
    });

    it(`expected input: "${defaultInput}"`, function(done) {
      esbuildTask.fn(done);
    });
  });

  describe('use esbuild with custom entries', function() {
    const defaultInput = ['src/scripts/index.js'];
    const defaultOutput = 'dist/js';

    before(function() {
      balm.config = {
        scripts: {
          bundler: 'esbuild',
          entry: defaultInput
        }
      };
    });

    it(`expected output: "${defaultOutput}"`, function(done) {
      esbuildTask.recipe(defaultInput, defaultOutput, {})(done);

      expect(JSON.stringify(esbuildTask.input)).to.equal(
        JSON.stringify(defaultInput)
      );
      expect(esbuildTask.output).to.equal(defaultOutput);
    });
  });
});
