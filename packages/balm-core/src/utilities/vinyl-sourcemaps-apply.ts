import { SourceMapGenerator, SourceMapConsumer } from 'source-map';

function assertProperty(sourceMap: object, propertyName: string) {
  if (!Object.prototype.hasOwnProperty.call(sourceMap, propertyName)) {
    throw new Error(
      `Source map to be applied is missing the "${propertyName}" property`
    );
  }
}

function applySourceMap(file: any, sourceMap: any) {
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
    const generator = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(sourceMap) as any
    );
    generator.applySourceMap(new SourceMapConsumer(file.sourceMap) as any);
    file.sourceMap = JSON.parse(generator.toString());
  } else {
    file.sourceMap = sourceMap;
  }
}

export default applySourceMap;
