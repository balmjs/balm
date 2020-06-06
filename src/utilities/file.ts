class File {
  get stylePaths(): string[] {
    return [
      path.resolve(BalmJS.config.workspace, '.'),
      path.resolve(BalmJS.config.workspace, 'node_modules'),
      ...BalmJS.config.styles.atImportPaths
    ];
  }

  get publicPath(): string {
    return BalmJS.config.env.isProd || BalmJS.config.assets.publicUrl === '/'
      ? BalmJS.config.assets.publicUrl
      : '';
  }

  get assetsSuffixPath(): string {
    return !BalmJS.config.inFrontend &&
      BalmJS.config.env.isProd &&
      BalmJS.config.assets.cache // Back-end project in production with cache
      ? path.join(BalmJS.config.assets.subDir, BalmJS.config.assets.buildDir)
      : BalmJS.config.assets.subDir;
  }

  absPath(_path: string): string {
    return path.resolve(BalmJS.config.workspace, _path);
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

  matchAllFiles(_path: string, _file?: string): string {
    return path.join(_path, '**', _file || '*');
  }

  assetsPath(_path: string): string {
    return BalmJS.config.env.isProd || !BalmJS.config.inFrontend
      ? path.posix.join(
          BalmJS.config.assets.virtualDir,
          this.assetsSuffixPath,
          _path
        )
      : _path;
  }

  setPublicPath(): any {
    const publicPath: string = /.*\/$/.test(this.publicPath)
      ? this.publicPath
      : `${this.publicPath}/`;

    const publicPathSrc = `${BalmJS.config.assets.publicUrlPlaceholder}/`;
    const publicPathDest: string = this.publicPath ? publicPath : '';

    BalmJS.logger.debug(
      `set public path`,
      {
        regex: publicPathSrc,
        replacement: publicPathDest
      },
      {
        pre: true
      }
    );

    return BalmJS.plugins.replace(publicPathSrc, publicPathDest);
  }
}

export default new File();
