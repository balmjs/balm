import fs from 'fs';
import mkdirp from 'mkdirp';
import Modernizr from 'modernizr';

class ModernizrTask extends BalmJS.BalmTask {
  constructor() {
    super('modernizr');

    this.defaultInput = BalmJS.file.absPath(`${this.name}.json`);
  }

  private _readConfig(): Promise<any> {
    return new Promise((resolve, reject): void => {
      fs.readFile(this.input, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }

  private _createDir(): Promise<any> {
    return new Promise((resolve, reject): void => {
      mkdirp(BalmJS.file.absPath(BalmJS.config.dest.js), (err: any) => {
        if (err) reject(err);
        resolve();
      });
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
          err => {
            if (err) reject(err);
            resolve(content);
          }
        );
      });
    });
  }

  fn(cb: Function): void {
    this.init();

    fs.access(this.input, fs.constants.F_OK, (err: any) => {
      if (err) {
        BalmJS.logger.warn(
          `${this.name} task`,
          `The '${this.input}' does not exist`
        );
        cb();
      } else {
        (async (): Promise<any> => {
          const [config] = await Promise.all([
            this._readConfig(),
            this._createDir()
          ]);
          await this._generateScript(config);
          cb();
        })();
      }
    });
  }
}

export default ModernizrTask;
