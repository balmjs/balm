class File {
  absPaths(_paths: string | string[]): string | string[] {
    let paths: string | string[];

    if (BalmJS.utils.isArray(_paths)) {
      paths = [];
      for (const _path of _paths) {
        paths.push(path.join(BalmJS.config.workspace, _path));
      }
    } else {
      const _path: string = _paths as string;
      paths = path.join(BalmJS.config.workspace, _path);
    }

    return paths;
  }

  stylePaths(): string[] {
    return [
      path.join(BalmJS.config.workspace, '.'),
      ...BalmJS.config.styles.includePaths
    ];
  }

  assetsPath(_path: string): string {
    return BalmJS.config.env.isProd || !BalmJS.config.inFrontend
      ? path.posix.join(
          BalmJS.config.assets.subDir,
          BalmJS.config.assets.buildDir,
          _path
        )
      : _path;
  }

  getPublicPath(): string {
    return BalmJS.config.env.isProd || BalmJS.config.assets.publicUrl === '/'
      ? BalmJS.config.assets.publicUrl
      : '';
  }
}

export default new File();
