import del from 'del';
import { ASSETS_KEYS } from '../../config/constants';

function unique(arr: string[]): string[] {
  const obj: any = {};
  const result: string[] = [];

  for (let i = 0, len = arr.length; i < len; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = true;
      result.push(arr[i].replace(/\\/g, '/')); // NOTE: compatible with windows for `del@5.x`
    }
  }

  return result;
}

class CleanTask extends BalmJS.BalmTask {
  constructor() {
    super('clean');
  }

  #getAssetsDir = (rootKey = 'assets'): string[] => {
    return unique(
      ASSETS_KEYS.map((assetKey) => (BalmJS.config as any)[rootKey][assetKey])
    );
  };

  get remoteRootDir(): string[] {
    return BalmJS.config.assets.root.trim().length
      ? [BalmJS.config.assets.root]
      : [];
  }

  get remoteAppDir(): string[] {
    return BalmJS.config.assets.subDir
      ? [BalmJS.config.assets.static as string]
      : this.#getAssetsDir();
  }

  get dirInFrontend(): string[] {
    const isLocal = !path.isAbsolute(BalmJS.config.assets.root);

    BalmJS.logger.info(
      `${this.name} task`,
      `'${BalmJS.config.assets.root}' is local directory: ${isLocal}`
    );

    return BalmJS.config.env.isProd
      ? [
          BalmJS.file.absPath(BalmJS.config.roots.target),
          ...(isLocal ? this.remoteRootDir : this.remoteAppDir)
        ]
      : [BalmJS.file.absPath(BalmJS.config.roots.tmp)];
  }

  get dirInBackend(): string[] {
    const hasBuildDir: boolean =
      BalmJS.config.assets.cache &&
      !!(BalmJS.config.assets.buildDir || BalmJS.config.assets.subDir);

    const buildDirInProd: string[] = hasBuildDir
      ? [BalmJS.config.dest.static]
      : [];

    const buildDirInDev: string[] = hasBuildDir
      ? [path.join(BalmJS.config.dest.static, BalmJS.config.assets.buildDir)] // NOTE: fix for `BalmJS.file.assetsSuffixPath` in development
      : [];

    return [
      ...(BalmJS.config.env.isProd && hasBuildDir
        ? buildDirInProd
        : [...buildDirInDev, ...this.#getAssetsDir('dest')])
    ];
  }

  fn = async (callback: Function): Promise<void> => {
    const taskName = `${this.name} task`;
    const directories: string[] = BalmJS.config.inFrontend
      ? this.dirInFrontend
      : this.dirInBackend;

    if (BalmJS.config.env.isProd && !BalmJS.config.assets.root) {
      BalmJS.logger.warn(taskName, 'Remote root path is empty');
    }

    BalmJS.logger.debug(
      taskName,
      {
        directories
      },
      {
        pre: true
      }
    );

    const deletedPaths: string[] = await del(directories, { force: true });

    BalmJS.logger.warn(
      taskName,
      {
        deletedPaths
      },
      {
        pre: true
      }
    );

    callback();
  };
}

export default CleanTask;
