/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/* eslint no-new: "error" */

/**
 * Array unique
 */
if (!Array.prototype.uniques) {
  Array.prototype.uniques = () => {
    return this.reduce((p, c) => {
      if (p.indexOf(c) < 0) {
        p.push(c);
      }
      return p;
    }, []);
  };
}

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
      return collection.tail ? collection.task.fn(collection.input, collection.output, collection.tail) : collection.task.fn(collection.input, collection.output);
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
        if ({}.hasOwnProperty.call(config.paths[rKey], pKey)) {
          config[rKey][pKey] = path.join(config.workspace, config.roots[rKey], config.paths[rKey][pKey]);
        }
      }
    }
  }

  // create cache dir
  config.cache.dir = config.target.cache || path.join(config.workspace, config.roots.cache);

  // set default js
  if (typeof config.scripts.entry === 'undefined') {
    config.scripts.entry = {
      main: config.source.js + '/main.js'
    };
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

export {
  isObject,
  mergeDeep,
  customTask,
  init
};
