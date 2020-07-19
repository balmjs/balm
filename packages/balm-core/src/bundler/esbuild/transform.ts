import { startService } from 'esbuild';
import { TransformResult } from '@balm-core/index';

const esTransform = (
  input: string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  const transformOptions = Object.assign(
    BalmJS.config.scripts.transformOptions,
    customOptions
  );

  (async () => {
    const service = await startService();

    const transformers: Promise<
      TransformResult
    >[] = input.map((entry: string) =>
      service.transform(entry, transformOptions)
    );

    try {
      const result = await Promise.all(transformers);
      // TODO: output result
      console.log(result);
    } finally {
      service.stop();
      callback();
    }
  })();
};

export default esTransform;
