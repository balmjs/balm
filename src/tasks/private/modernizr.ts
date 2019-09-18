import fs from 'fs';
import mkdirp from 'mkdirp';
import Modernizr from 'modernizr';

class ModernizrTask extends BalmJS.BalmTask {
  constructor() {
    super('modernizr');
  }

  readConfig(): Promise<any> {
    return new Promise((resolve, reject): void => {
      fs.readFile(
        BalmJS.file.absPaths(`${this.name}.json`),
        'utf8',
        (err, data) => {
          if (err) reject(err);
          resolve(JSON.parse(data));
        }
      );
    });
  }

  createDir(): Promise<any> {
    return new Promise((resolve, reject): void => {
      mkdirp(BalmJS.file.absPaths(BalmJS.config.dest.js), (err: any) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  generateScript(config: object): Promise<any> {
    return new Promise((resolve, reject): void => {
      Modernizr.build(config, (content: any) => {
        fs.writeFile(
          BalmJS.file.absPaths(
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
    (async (): Promise<any> => {
      const [config] = await Promise.all([this.readConfig(), this.createDir()]);
      await this.generateScript(config);
      cb();
    })();
  }
}

export = ModernizrTask;
