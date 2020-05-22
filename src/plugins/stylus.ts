// // Reference `gulp-stylus@2.7.0`
// import { extname } from 'path';
// import accord from 'accord';
// import applySourceMap from '../utilities/vinyl-sourcemaps-apply';
// import replaceExt from '../utilities/replace-ext';

// const stylus = accord.load('stylus');

// interface StylusOptions {
//   filename?: string;
//   sourcemap?: boolean;
//   define?: string;
// }

// function guErr(err: any): any {
//   return new PluginError('gulp-stylus', err);
// }

// function gulpStylus(options: object): any {
//   const opts: StylusOptions = Object.assign({}, options);

//   return through2.obj(function (file: any, enc: string, cb: Function) {
//     if (file.isStream()) {
//       return cb(guErr('Streaming not supported'));
//     }
//     if (file.isNull()) {
//       return cb(null, file);
//     }
//     if (extname(file.path) === '.css') {
//       return cb(null, file);
//     }
//     if (file.sourceMap || opts.sourcemap) {
//       opts.sourcemap = Object.assign({ basePath: file.base }, opts.sourcemap);
//     }
//     if (file.data) {
//       opts.define = file.data;
//     }
//     opts.filename = file.path;

//     stylus
//       .render(file.contents.toString(enc || 'utf-8'), opts)
//       .catch(function (err: any) {
//         delete err.input;
//         return cb(guErr(err));
//       })
//       .done(function (res: any) {
//         if (res == null) {
//           return;
//         }
//         if (res.result !== undefined) {
//           file.path = replaceExt(file.path, '.css');
//           if (res.sourcemap) {
//             res.result = res.result.replace(
//               /\/\*[@#][\s\t]+sourceMappingURL=.*?\*\/$/gm,
//               ''
//             );
//             res.sourcemap.file = file.relative;
//             applySourceMap(file, res.sourcemap);
//           }
//           file.contents = new Buffer(res.result);
//           return cb(null, file);
//         }
//       });
//   });
// }

// export default gulpStylus;
