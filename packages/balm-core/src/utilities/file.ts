import fs from 'fs';
import { URL } from 'url';
import { PUBLIC_URL } from '../config/constants';

// Make sure any symlinks in the project folder are resolved
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath);

class File {
  /**
   * Returns a URL or a path with slash at the end
   * In production can be URL, abolute path, relative path
   * In development always will be an absolute path
   * In development can use `path` module functions for operations
   */
  getPublicUrlOrPath(homepage?: string, envPublicUrl?: string): string {
    const stubDomain = 'https://balm.js.org';

    if (envPublicUrl) {
      // ensure last slash exists
      envPublicUrl = envPublicUrl.endsWith('/')
        ? envPublicUrl
        : envPublicUrl + '/';

      // validate if `envPublicUrl` is a URL or path like
      // `stubDomain` is ignored if `envPublicUrl` contains a domain
      const validPublicUrl = new URL(envPublicUrl, stubDomain);

      return BalmJS.config.env.isDev
        ? envPublicUrl.startsWith('.')
          ? '/'
          : validPublicUrl.pathname
        : // Some apps do not use client-side routing with pushState.
          // For these, "homepage" can be set to "." to enable relative asset paths.
          envPublicUrl;
    }

    if (homepage) {
      // strip last slash if exists
      homepage = homepage.endsWith('/') ? homepage : homepage + '/';

      // validate if `homepage` is a URL or path like and use just pathname
      const validHomepagePathname = new URL(homepage, stubDomain).pathname;
      return BalmJS.config.env.isDev
        ? homepage.startsWith('.')
          ? '/'
          : validHomepagePathname
        : // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        homepage.startsWith('.')
        ? homepage
        : validHomepagePathname;
    }

    return '/';
  }

  get publicUrlOrPath(): string {
    // We use `PUBLIC_URL` environment variable or "homepage" field to infer
    // "public path" at which the app is served.
    // webpack needs to know it to put the right <script> hrefs into HTML even in
    // single-page apps that may serve index.html for nested URLs like /todos/42.
    // We can't use a relative path in HTML because we don't want to load something
    // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
    return this.getPublicUrlOrPath(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(resolveApp('package.json')).homepage,
      process.env.PUBLIC_URL
    );
  }

  get stylePaths(): string[] {
    return [
      path.resolve(BalmJS.config.workspace, '.'),
      path.resolve(BalmJS.config.workspace, 'node_modules'),
      ...BalmJS.config.styles.atImportPaths
    ];
  }

  get assetsSuffixPath(): string {
    return !BalmJS.config.inFrontend &&
      BalmJS.config.env.isProd &&
      BalmJS.config.assets.cache // Back-end project in production with cache
      ? path.join(BalmJS.config.assets.subDir, BalmJS.config.assets.buildDir)
      : BalmJS.config.assets.subDir;
  }

  get defaultEntry(): string {
    return path.join(
      BalmJS.config.roots.source,
      BalmJS.config.paths.source.js,
      'index.js'
    );
  }

  absPath(_path: string): string {
    return path.resolve(BalmJS.config.workspace, _path);
  }

  absPaths(_paths: string | string[]): string | string[] {
    let paths: string | string[];

    if (BalmJS.utils.isArray(_paths)) {
      paths = [];
      for (const _path of _paths) {
        const result: RegExpExecArray = /^!(.+)$/.exec(
          _path
        ) as RegExpExecArray;
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
    const publicPathSrc = `${PUBLIC_URL}/`;
    const publicPathDest: string = this.publicUrlOrPath;

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
