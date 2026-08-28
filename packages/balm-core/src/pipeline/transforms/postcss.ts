import postcss, { AcceptedPlugin } from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export interface PostcssTransformOptions {
  plugins?: AcceptedPlugin[];
  minify?: boolean;
  [key: string]: any;
}

export function transformPostcss(options: PostcssTransformOptions = {}): TransformFn {
  const plugins: AcceptedPlugin[] = [
    ...(options.plugins || []),
    autoprefixer(),
    postcssPresetEnv()
  ];

  if (options.minify) {
    plugins.push(cssnano({ preset: 'default' }));
  }

  const processor = postcss(plugins);

  return async (file) => {
    if (!/\.css$/i.test(file.extname)) return file;

    try {
      const result = await processor.process(file.toString(), {
        from: file.path,
        to: file.path
      });

      file.contents = Buffer.from(result.css);
      return file;
    } catch (err: any) {
      logger.error('postcss', `Error processing ${file.path}: ${err.message}`);
      throw err;
    }
  };
}
