/**
 * Simple is object check.
 * @param {Any} item
 * @returns {Boolean}
 */
const isObject = item => {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
};

/**
 * Deep merge two objects.
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 */
const mergeDeep = (target, source) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {
            [key]: {}
          });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    });
  }
  return target;
};

/**
 * Create custom task
 * @param  {String} buildTask
 */
const customTask = (buildTask = '') => {
  if (config.debug) {
    $.util.log($.util.colors.blue('Custom task:'), RN, collections, RN);
  }

  let customTasks = [];
  let customTaskIndex = 0;
  for (let collection of collections) {
    let customTaskName = collection.task.name + '-' + customTaskIndex;
    gulp.task(customTaskName, () => {
      return collection.tail ?
        collection.task.fn(collection.input, collection.output, collection.tail) :
        collection.task.fn(collection.input, collection.output);
    });
    customTasks.push(customTaskName);
    customTaskIndex++;
  }

  if (customTasks.length) {
    let deps = buildTask ? [buildTask] : [];

    gulp.task('custom', deps, () => {
      require('run-sequence').apply(this, customTasks);
    });
    gulp.start('custom');
  } else {
    gulp.start(buildTask);
  }
};

/**
 * Balm initialization
 */
const init = () => {
  let assets = ['css', 'js', 'img', 'font'];
  // create quick dir
  for (let rKey in config.roots) {
    if ({}.hasOwnProperty.call(config.roots, rKey)) {
      config[rKey] = {};
      for (let pKey in config.paths[rKey]) {
        if ({}.hasOwnProperty.call(config.paths[rKey], pKey)) {
          config[rKey][pKey] = (rKey === 'target' && assets.indexOf(pKey) > -1) ?
            path.join(config.workspace, config.roots[rKey], config.assets.subDir, config.paths[rKey][pKey]) :
            path.join(config.workspace, config.roots[rKey], config.paths[rKey][pKey]);
        }
      }
    }
  }

  // create assets dir
  config.target.static = path.join(config.target.base, config.assets.subDir);
  config.assets.static = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);
  for (let asset of assets) {
    config.assets[asset] = path.join(config.assets.static, config.paths.target[asset]);
  }

  // set default js
  if (!Object.keys(config.scripts.entry).length) {
    config.scripts.entry.main = config.source.js + '/main.js';
  }

  // set loader js
  const Loaders = require('./loaders').default;
  new Loaders();

  // create task
  const Tasks = require('./tasks').default;
  new Tasks();

  if (config.debug) {
    $.util.log($.util.colors.green('Balm configuration:'), RN, config, RN);
  }
};

const assetsPath = _path => {
  return config.production ? path.posix.join(config.assets.subDir, _path) : _path;
};

export {
  mergeDeep,
  customTask,
  init,
  assetsPath
};
