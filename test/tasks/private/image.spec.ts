import ImageTask from '../../../packages/balm-core/src/tasks/private/image';

describe('Image Task', function() {
  let imageTask: any;

  beforeEach(function() {
    imageTask = new ImageTask();
    imageTask.fn();
  });

  describe('without sprites', function() {
    const defaultInput = [
      path.join(balm.config.workspace, 'src', 'images', '**', '*')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        expect(JSON.stringify(imageTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with sprites', function() {
    before(function() {
      balm.config = {
        styles: {
          sprites: ['icons']
        }
      };
    });

    const defaultInput = [
      path.join(balm.config.workspace, 'src', 'images', '**', '*'),
      '!' + path.join(balm.config.workspace, 'src', 'images', 'icons'),
      '!' + path.join(balm.config.workspace, 'src', 'images', 'icons', '*.png')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        expect(JSON.stringify(imageTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with custom plugins', function() {
    before(function() {
      balm.config = {
        images: {
          plugins: []
        }
      };
    });

    it(
      'use imagemin custom plugins',
      asyncCase(function() {})
    );
  });
});
