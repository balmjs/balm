import ImageTask from '../../../packages/balm-core/src/tasks/private/image';

describe('Image Task', function () {
  let imageTask: any;

  beforeEach(function () {
    imageTask = new ImageTask();
    imageTask.fn();
  });

  describe('without sprites', function () {
    const defaultInput = [
      node.path.join(balm.config.workspace, 'src', 'images', '**', '*')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        expect(JSON.stringify(imageTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with sprites', function () {
    before(function () {
      balm.config = {
        styles: {
          sprites: ['icons']
        }
      };
    });

    const defaultInput = [
      node.path.join(balm.config.workspace, 'src', 'images', '**', '*'),
      '!' + node.path.join(balm.config.workspace, 'src', 'images', 'icons'),
      '!' +
        node.path.join(balm.config.workspace, 'src', 'images', 'icons', '*.png')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        expect(JSON.stringify(imageTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with custom plugins', function () {
    before(function () {
      balm.config = {
        images: {
          plugins: []
        }
      };
    });

    it(
      'use imagemin custom plugins',
      asyncCase(function () {})
    );
  });
});
