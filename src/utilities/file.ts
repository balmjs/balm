class File {
  get stylePaths(): string[] {
    return [
      path.join(BalmJS.config.workspace, '.'),
      ...BalmJS.config.styles.atImportPaths
    ];
  }

  get publicPath(): string {
    return BalmJS.config.env.isProd || BalmJS.config.assets.publicUrl === '/'
      ? BalmJS.config.assets.publicUrl
      : '';
  }

  get assetsSuffixPath(): string {
    return path.join(
      BalmJS.config.assets.subDir,
      BalmJS.config.assets.buildDir
    );
  }

  absPath(_path: string): string {
    return path.join(BalmJS.config.workspace, _path);
  }

  absPaths(_paths: string | string[]): string | string[] {
    let paths: string | string[];

    if (BalmJS.utils.isArray(_paths)) {
      paths = [];
      for (const _path of _paths) {
        const result: any = /^!(.+)$/.exec(_path);
        if (result) {
          paths.push('!' + this.absPath(result[1]));
        } else {
          paths.push(this.absPath(_path));
        }
      }
    } else {
      paths = this.absPath(_paths as string);
    }

    return paths;
  }

  assetsPath(_path: string): string {
    return BalmJS.config.env.isProd || !BalmJS.config.inFrontend
      ? path.posix.join(this.assetsSuffixPath, _path)
      : _path;
  }
}

export default new File();
