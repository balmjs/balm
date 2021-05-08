import { build } from 'modernizr';

class ModernizrTask extends BalmJS.BalmTask {
  constructor() {
    super('modernizr');

    this.defaultInput = `${this.name}.json`;
    this.defaultOutput = node.path.join(
      BalmJS.config.dest.js,
      `${this.name}.js`
    );
  }

  #readConfig = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      node.fs.readFile(this.input, 'utf8', (err: any, data: any) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  };

  #createDir = (): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      node.fs.mkdir(
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
        node.fs.writeFile(this.output, content, (err: any) => {
          if (err) reject(err);
          resolve(content);
        });
      });
    });
  };

  fn = async (callback: Function): Promise<void> => {
    this.init();

    if (node.fs.existsSync(this.input)) {
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
