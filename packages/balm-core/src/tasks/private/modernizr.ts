import fs from 'node:fs';
import { build } from 'modernizr';

class ModernizrTask extends BalmJS.BalmTask {
  constructor() {
    super('modernizr');

    this.defaultInput = `${this.name}.json`;
    this.defaultOutput = path.join(BalmJS.config.dest.js, `${this.name}.js`);
  }

  #readConfig = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      fs.readFile(this.input, 'utf8', (err: any, data: any) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  };

  #createDir = (): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(
        BalmJS.file.absPath(BalmJS.config.dest.js),
        { recursive: true },
        (err: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  };

  #generateScript = (config: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      build(config, (content: any) => {
        fs.writeFile(this.output, content, (err: any) => {
          if (err) reject(err);
          resolve(content);
        });
      });
    });
  };

  fn = async (callback: Function): Promise<void> => {
    this.init();

    if (fs.existsSync(this.input)) {
      const [config] = await Promise.all([
        this.#readConfig(),
        this.#createDir()
      ]);

      await this.#generateScript(config);
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
