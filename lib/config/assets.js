"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var publicUrlPlaceholder = '%PUBLIC_URL%';
var publicUrl = ''; // Replace `%PUBLIC_URL%/` in html templates (the same to `scripts.webpack.output.publicPath`)
var root = 'assets'; // Remote project root simulation
var mainDir = 'public'; // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
var subDir = ''; // Public subdirectory
var buildDir = 'build'; // The suffix of the `subDir`: for dynamic language project
var virtualDir = ''; //  The prefix of the `subDir`: for non-standard dynamic language project
var cache = false;
/**
 * Static asset revisioning
 *
 * @reference https://github.com/smysnk/gulp-rev-all#options
 */
var options = {
    fileNameManifest: 'rev-manifest.json',
    dontRenameFile: ['.html'],
    dontUpdateReference: ['.html']
};
var includes = [];
var excludes = [];
exports.default = {
    publicUrlPlaceholder: publicUrlPlaceholder,
    publicUrl: publicUrl,
    root: root,
    mainDir: mainDir,
    subDir: subDir,
    buildDir: buildDir,
    virtualDir: virtualDir,
    cache: cache,
    options: options,
    includes: includes,
    excludes: excludes
};
