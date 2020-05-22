// // Reference `gulp-less@4.0.1`
// import path from 'path';
// import accord from 'accord';
// import applySourceMap from './vinyl-sourcemaps-apply';
// import replaceExt from './replace-ext';

// const less = accord.load('less');

// interface LessOptions {
//   compress: boolean;
//   paths: string[];
//   filename?: string;
//   sourcemap?: boolean;
// }

// function gulpLess(options: object = {}): any {
//   // Mixes in default options.
//   const opts: LessOptions = Object.assign(
//     {},
//     {
//       compress: false,
//       paths: []
//     },
//     options
//   );

//   return through2.obj(function (file: any, enc: string, cb: Function) {
//     if (file.isNull()) {
//       return cb(null, file);
//     }

//     if (file.isStream()) {
//       return cb(new PluginError('gulp-less', 'Streaming not supported'));
//     }

//     const str: string = file.contents.toString();

//     // Injects the path of the current file
//     opts.filename = file.path;

//     // Bootstrap source maps
//     if (file.sourceMap) {
//       opts.sourcemap = true;
//     }

//     less
//       .render(str, opts)
//       .then((res: any) => {
//         file.contents = new Buffer(res.result);
//         file.path = replaceExt(file.path, '.css');
//         if (res.sourcemap) {
//           res.sourcemap.file = file.relative;
//           res.sourcemap.sources = res.sourcemap.sources.map(
//             (source: string) => {
//               return path.relative(file.base, source);
//             }
//           );

//           applySourceMap(file, res.sourcemap);
//         }
//         return file;
//       })
//       .then(function (file: any) {
//         cb(null, file);
//       })
//       .catch(function (err: any) {
//         // Convert the keys so PluginError can read them
//         err.lineNumber = err.line;
//         err.fileName = err.filename;

//         // Add a better error message
//         err.message =
//           err.message +
//           ' in file ' +
//           err.fileName +
//           ' line no. ' +
//           err.lineNumber;
//         return cb(new PluginError('gulp-less', err));
//       });
//   });
// }

// export default gulpLess;
