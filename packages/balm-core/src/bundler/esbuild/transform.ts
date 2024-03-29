import { transform } from 'esbuild';
import { minifyOptions } from './options.js';
import { TransformOptions } from '@balm-core/index';

const esTransform = (
  entryPoints: string[],
  output: string,
  customTransformOptions: TransformOptions,
  callback: Function
): void => {
  const build: {
    input?: string;
    output: string;
  } = {
    output: BalmJS.file.absPath(output)
  };

  const transformOptions = BalmJS.config.env.isProd
    ? Object.assign({}, minifyOptions)
    : {};

  const options = Object.assign(
    transformOptions,
    BalmJS.config.scripts.transformOptions,
    customTransformOptions
  );

  (async () => {
    try {
      for await (const entryPoint of entryPoints) {
        build.input = BalmJS.file.absPath(entryPoint);

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

        const filename = entryPoint.split('/').pop();
        if (filename && node.fs.existsSync(build.input)) {
          const inputCode = node.fs.readFileSync(build.input, 'utf8');
          const result = await transform(inputCode, options);

          node.fs.mkdirSync(build.output, { recursive: true });
          node.fs.writeFileSync(
            node.path.join(build.output, filename),
            result.code
          );
        } else {
          BalmJS.logger.warn('esbuild', `Invalid entry point: ${entryPoint}`);
        }
      }
    } finally {
      callback();
    }
  })();
};

export default esTransform;
