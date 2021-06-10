import LessTask from '../../../packages/balm-core/src/tasks/public/less';

describe('Less Task', function () {
  let lessTask: any;

  beforeEach(function () {
    lessTask = new LessTask();
  });

  describe('default', function () {
    before(function () {
      balm.config = {
        styles: {
          extname: 'less'
        }
      };
    });

    const defaultInput = node.path.join(
      balm.config.workspace,
      'src',
      'styles',
      '**',
      '!(_*).less'
    );

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        lessTask.fn();

        expect(lessTask.input).to.equal(defaultInput);
      })
    );
  });

  describe('#mix.less()', function () {
    before(function () {
      balm.config = {
        styles: {
          extname: 'less'
        }
      };
    });

    const defaultInput = [node.path.join('less', '*.less')];
    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        lessTask.recipe(defaultInput, defaultOutput, {})();

        expect(JSON.stringify(lessTask.input)).to.equal(
          JSON.stringify([
            node.path.join(balm.config.workspace, 'less', '*.less')
          ])
        );
        expect(lessTask.output).to.equal(
          node.path.join(balm.config.workspace, defaultOutput)
        );
      })
    );
  });
});
