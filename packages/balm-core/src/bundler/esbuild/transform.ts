import fs from 'fs';
import { startService } from 'esbuild';

const esTransform = (
  input: string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  const build: {
    input?: string;
    output: string;
  } = {
    output: BalmJS.file.absPath(output)
  };

  const transformOptions = Object.assign(
    BalmJS.config.scripts.transformOptions,
    customOptions
  );

  (async () => {
    const service = await startService();

    try {
      for await (const entry of input) {
        build.input = BalmJS.file.absPath(entry);

        BalmJS.logger.debug(
          'esbuild bundler - transform',
          {
            input: build.input,
            output: build.output
          },
          {
            pre: true
          }
        );

        const filename = entry.split('/').pop();
        if (filename && fs.existsSync(build.input)) {
          const input = fs.readFileSync(build.input, 'utf8');
          const result = await service.transform(input, transformOptions);

          fs.mkdirSync(build.output, { recursive: true });
          fs.writeFileSync(path.join(build.output, filename), result.code);
        } else {
          BalmJS.logger.warn('esbuild', `Invalid entry: ${entry}`);
        }
      }
    } finally {
      service.stop();
      callback();
    }
  })();
};

export default esTransform;
