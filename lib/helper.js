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
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
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
    console.info('Custom task:')
    console.log(collections);
  }

  let customTasks = [];
  let customTaskIndex = 0;
  for (let collection of collections) {
    let customTaskName = collection.task.name + '-' + customTaskIndex;
    gulp.task(customTaskName, () => {
      return collection.task.fn(collection.input, collection.output);
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
  // create quick dir
  for (let rKey in config.roots) {
    if (['source', 'tmp', 'target'].indexOf(rKey) > -1) {
      config[rKey] = {};
      for (let pKey in config.paths[rKey]) {
        config[rKey][pKey] = path.join(config.roots[rKey], config.paths[rKey][pKey]);
      }
    }
  }

  // create cache dir
  config.cacheDir = config.target.cache || config.roots.cache;

  // set default js
  if (typeof config.scripts.entry === 'undefined') {
    config.scripts.entry = {
      main: './' + config.source.js + '/main.js'
    };
  }

  // set loader js
  const Loader = require('./loader').default;
  new Loader();

  // create task
  const Task = require('./task').default;
  new Task();

  if (config.debug) {
    console.info('Balm configuration:');
    console.log(config);
    console.log('\n');
  }
};

export {
  isObject,
  mergeDeep,
  customTask,
  init
};
