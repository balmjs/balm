import SpriteTask from '../../../lib/tasks/private/sprite';

describe('Sprite Task', () => {
  it('generate sprite images', done => {
    const spriteTask = new SpriteTask();
    const task = spriteTask.deps.map(
      taskName => `${BalmJS.NAMESPACE}:${taskName}`
    );
    const test = 'dist/web/c/img-icon-sprite.png';

    runTask({
      task,
      test,
      done
    });
  });
});
