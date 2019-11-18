const publicUrlPlaceholder = '%PUBLIC_URL%';
const publicUrl = ''; // Replace `%PUBLIC_URL%/` in html templates (the same to `scripts.webpack.output.publicPath`)
const root = 'assets'; // Remote project root simulation
const mainDir = 'public'; // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
const subDir = ''; // Public subdirectory
const buildDir = 'build'; // The suffix of the `subDir`: for dynamic language project
const virtualDir = ''; //  The prefix of the `subDir`: for non-standard dynamic language project

const cache = false;
/**
 * Static asset revisioning
 *
 * @reference https://github.com/smysnk/gulp-rev-all#options
 */
const options: object = {
  fileNameManifest: 'rev-manifest.json',
  dontRenameFile: ['.html'],
  dontUpdateReference: ['.html']
};
const includes: string[] = [];
const excludes: string[] = [];

export default {
  publicUrlPlaceholder,
  publicUrl,
  root,
  mainDir,
  subDir,
  buildDir,
  virtualDir,
  cache,
  options,
  includes,
  excludes
};
