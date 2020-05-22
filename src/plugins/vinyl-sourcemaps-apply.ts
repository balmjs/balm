// import { SourceMapGenerator, SourceMapConsumer } from 'source-map';

// function assertProperty(sourceMap: RawSourceMap, propertyName: string): void {
//   if (!sourceMap.hasOwnProperty(propertyName)) {
//     const e = new Error(
//       'Source map to be applied is missing the "' + propertyName + '" property'
//     );
//     throw e;
//   }
// }

// function applySourceMap(file: any, sourceMap: RawSourceMap): void {
//   if (typeof sourceMap === 'string' || sourceMap instanceof String) {
//     sourceMap = JSON.parse(sourceMap);
//   }

//   if (
//     file.sourceMap &&
//     (typeof file.sourceMap === 'string' || file.sourceMap instanceof String)
//   ) {
//     file.sourceMap = JSON.parse(file.sourceMap);
//   }

//   // check source map properties
//   assertProperty(sourceMap, 'file');
//   assertProperty(sourceMap, 'mappings');
//   assertProperty(sourceMap, 'sources');

//   // fix paths if Windows style paths
//   sourceMap.file = sourceMap.file.replace(/\\/g, '/');
//   sourceMap.sources = sourceMap.sources.map(function (filePath) {
//     return filePath.replace(/\\/g, '/');
//   });

//   if (file.sourceMap && file.sourceMap.mappings !== '') {
//     const generator = SourceMapGenerator.fromSourceMap(
//       new SourceMapConsumer(sourceMap)
//     );
//     generator.applySourceMap(new SourceMapConsumer(file.sourceMap));
//     file.sourceMap = JSON.parse(generator.toString());
//   } else {
//     file.sourceMap = sourceMap;
//   }
// }

// export default applySourceMap;
