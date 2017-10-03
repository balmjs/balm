import {isArray} from './index';

class File {
  static absPaths(_paths) {
    let paths;

    if (isArray(_paths)) {
      paths = [];
      for (let _path of _paths) {
        paths.push(path.join(config.workspace, _path));
      }
    } else {
      paths = path.join(config.workspace, _paths);
    }

    return paths;
  }
  static stylePaths() {
    return [path.join(config.workspace, '.')].concat(config.styles.includePaths);
  }
  static assetsPath(_path) {
    return config.production
      ? path.posix.join(config.assets.subDir, _path)
      : _path;
  }
  static setPublicPath() {
    let publicUrl = (config.production || config.assets.publicUrl === '/')
      ? config.assets.publicUrl
      : '';
    return $.replace(`${config.assets.publicUrlPlaceholder}/`, publicUrl);
  }
}

export default File;
