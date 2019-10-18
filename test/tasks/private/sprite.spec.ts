import SpriteTask from '../../../src/tasks/private/sprite';

describe('sprite task', function() {
  let spriteTask: any;

  beforeEach(function() {
    spriteTask = new SpriteTask();
  });

  describe('without sprites', function() {
    before(function() {
      balm.config = {
        styles: {
          sprites: []
        }
      };
    });

    it(
      `deps length expected output: 0`,
      asyncCase(function() {
        expect(spriteTask.deps.length).to.equal(0);
      })
    );
  });

  describe('with 2 sprites', function() {
    before(function() {
      balm.config = {
        styles: {
          sprites: ['icons', 'icons2']
        }
      };
    });

    it(
      `deps length expected output: 2`,
      asyncCase(function() {
        expect(spriteTask.deps.length).to.equal(2);
      })
    );
  });
});
