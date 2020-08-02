import fs from 'fs';
import Modernizr from 'modernizr';

class ModernizrTask extends BalmJS.BalmTask {
  constructor() {
    super('modernizr');

    this.defaultInput = BalmJS.file.absPath(`${this.name}.json`);
  }

  private _readConfig(): Promise<any> {
    return new Promise((resolve, reject): void => {
      fs.readFile(this.input, 'utf8', (err: any, data: any) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }

  private _createDir(): Promise<any> {
    return new Promise((resolve, reject): void => {
      fs.mkdir(
        BalmJS.file.absPath(BalmJS.config.dest.js),
        { recursive: true },
        (err: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  private _generateScript(config: object): Promise<any> {
    return new Promise((resolve, reject): void => {
      Modernizr.build(config, (content: any) => {
        fs.writeFile(
          BalmJS.file.absPath(
            path.join(BalmJS.config.dest.js, `${this.name}.js`)
          ),
          content,
          (err: any) => {
            if (err) reject(err);
            resolve(content);
          }
        );
      });
    });
  }

  fn = async (callback: Function): Promise<any> => {
    this.init();

    if (fs.existsSync(this.input)) {
      const [config] = await Promise.all([
        this._readConfig(),
        this._createDir()
      ]);

      await this._generateScript(config);
    } else {
      BalmJS.logger.warn(
        `${this.name} task`,
        `The '${this.input}' does not exist`,
        {
          logLevel: BalmJS.LogLevel.Info
        }
      );
    }

    callback();
  };
}

export default ModernizrTask;
