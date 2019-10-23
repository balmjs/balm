import ImageTask from '../../../src/tasks/private/image';

describe('image task', function() {
  let imageTask: any;

  beforeEach(function() {
    imageTask = new ImageTask();
    imageTask.fn();
  });

  describe('without sprites', function() {
    before(function() {
      balm.go();
    });

    const defaultInput = [path.join('src', 'images', '**', '*')];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        console.log(imageTask.input);
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
      balm.go();
    });

    const defaultInput = [
      path.join('src', 'images', '**', '*'),
      path.join('!src', 'images', 'icons'),
      path.join('!src', 'images', 'icons', '*.png')
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
});
