const ASSETS = ['css', 'js', 'img', 'font'];

/**
 * Balm initialization
 */
const init = () => {
  // create quick dir
  for (let rKey in config.roots) {
    if ({}.hasOwnProperty.call(config.roots, rKey)) {
      config[rKey] = {};
      for (let pKey in config.paths[rKey]) {
        if ({}.hasOwnProperty.call(config.paths[rKey], pKey)) {
          config[rKey][pKey] = (rKey === 'target' && ASSETS.indexOf(pKey) > -1) ?
            path.join(config.workspace, config.roots[rKey], config.assets.subDir, config.paths[rKey][pKey]) :
            path.join(config.workspace, config.roots[rKey], config.paths[rKey][pKey]);
        }
      }
    }
  }

  // create assets dir
  config.target.static = path.join(config.target.base, config.assets.subDir);
  config.assets.static = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);
  for (let asset of ASSETS) {
    config.assets[asset] = path.join(config.assets.static, config.paths.target[asset]);
  }

  // set default js
  if (!Object.keys(config.scripts.entry).length) {
    config.scripts.entry.main = config.source.js + '/main.js';
  }

  // set loader js
  require('./loaders');

  // register task
  require('./tasks');

  BalmJS.log('Balm configuration', config, 'success');
};

/**
 * Balm recipe
 */
const createRecipe = () => {
  let customTaskIndex = 1;

  for (let collection of BalmJS.collections) {
    let customTaskName = collection.task.name + '-' + customTaskIndex;

    gulp.task(customTaskName, () => {
      return collection.tail ?
        collection.task.fn(collection.input, collection.output, collection.tail) :
        collection.task.fn(collection.input, collection.output);
    });

    BalmJS.recipes.push(customTaskName);
    customTaskIndex++;
  }
};

/**
 * Balm start
 */
const ready = (taskName = 'default') => {
  if (!BalmJS.isRunning) {
    if (BalmJS.tasks.indexOf(taskName) === -1) {
      BalmJS.log('Invalid task', taskName, 'warning');
    } else {
      createRecipe();
      gulp.start(taskName);
      BalmJS.isRunning = true;
    }
  }
};

export {
  init,
  ready
};
