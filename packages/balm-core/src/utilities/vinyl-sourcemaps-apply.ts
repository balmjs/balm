import { SourceMapGenerator, SourceMapConsumer } from 'source-map';

function assertProperty(sourceMap: object, propertyName: string) {
  if (!Object.prototype.hasOwnProperty.call(sourceMap, propertyName)) {
    throw new Error(
      `Source map to be applied is missing the "${propertyName}" property`
    );
  }
}

async function applySourceMap(file: any, sourceMap: any): Promise<void> {
  if (typeof sourceMap === 'string' || sourceMap instanceof String) {
    sourceMap = JSON.parse(sourceMap as string);
  }

  if (
    file.sourceMap &&
    (typeof file.sourceMap === 'string' || file.sourceMap instanceof String)
  ) {
    file.sourceMap = JSON.parse(file.sourceMap);
  }

  // check source map properties
  assertProperty(sourceMap, 'file');
  assertProperty(sourceMap, 'mappings');
  assertProperty(sourceMap, 'sources');

  // fix paths if Windows style paths
  sourceMap.file = sourceMap.file.replace(/\\/g, '/');
  sourceMap.sources = sourceMap.sources.map((filePath: string) =>
    filePath.replace(/\\/g, '/')
  );

  if (file.sourceMap && file.sourceMap.mappings !== '') {
    const sourceMapConsumer = await new SourceMapConsumer(sourceMap);
    const generator = SourceMapGenerator.fromSourceMap(sourceMapConsumer);
    const fileSourceMapConsumer = await new SourceMapConsumer(file.sourceMap);
    generator.applySourceMap(fileSourceMapConsumer);
    file.sourceMap = JSON.parse(generator.toString());
  } else {
    file.sourceMap = sourceMap;
  }
}

export default applySourceMap;
