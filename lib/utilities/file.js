import { isArray } from '.';

class BalmFile {
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
    return [path.join(config.workspace, '.'), ...config.styles.includePaths];
  }

  static assetsPath(_path) {
    return config.isProd || !config.static
      ? path.posix.join(config.assets.subDir, _path)
      : _path;
  }

  static getPublicPath() {
    return config.isProd || config.assets.publicUrl === '/'
      ? config.assets.publicUrl
      : '';
  }

  static setPublicPath() {
    return $.replace(
      `${config.assets.publicUrlPlaceholder}/`,
      this.getPublicPath()
    );
  }
}

export default BalmFile;
