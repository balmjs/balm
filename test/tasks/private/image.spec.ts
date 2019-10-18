import ImageTask from '../../../src/tasks/private/image';

describe('font task', function() {
  let imageTask: any;

  beforeEach(function() {
    imageTask = new ImageTask();
    imageTask.fn();
  });

  describe('without sprites', function() {
    before(function() {
      balm.go();
    });

    const defaultInput = ['src/images/**/*'];

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
      balm.go();
    });

    const defaultInput = [
      'src/images/**/*',
      '!src/images/icons',
      '!src/images/icons/*.png'
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
