import PwaTask from '../../../src/tasks/public/pwa';

describe('Pwa Task', function() {
  let pwaTask: any;

  beforeEach(function() {
    balm.config = {
      pwa: {
        enabled: true
      }
    };

    pwaTask = new PwaTask();
  });

  it('generateSW mode', function(done) {
    pwaTask.fn(done);
  });

  it('injectManifest mode', function(done) {
    pwaTask.recipe('injectManifest', {})(done);
  });

  it('invalid', function(done) {
    pwaTask.recipe('unknown')(done);
  });
});
