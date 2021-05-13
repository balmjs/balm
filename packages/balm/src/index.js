import { getBalmEnv, setBalmConfig, getBalmCore } from './bootstrap/index.js';
import { title, message } from './config.js';

(async () => {
  await getBalmEnv();

  setBalmConfig(async (balmConfig) => {
    const { balm, run } = await getBalmCore(); // Get `balm-core`

    if (typeof balmConfig === 'function') {
      let { config, beforeTask, afterTask, api } = balmConfig(balm);

      if (config) {
        balm.config = config;

        if (beforeTask) {
          balm.beforeTask = beforeTask;
        }
        if (afterTask) {
          balm.afterTask = afterTask;
        }

        api ? balm.go(api) : balm.go();
        run();
      } else {
        console.warn(title, message.config);
      }
    } else {
      balm.config = balmConfig || {};

      balm.go();
      run();
    }
  });
})();
