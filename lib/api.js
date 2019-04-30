import BalmBuilder from './utilities/builder';

class Api {
  // HTML

  html() {
    BalmBuilder.generate('Html');
  }

  // Stylesheets

  css(input, output) {
    BalmBuilder.generate('Css', [input, output]);
  }

  sass(input, output) {
    BalmBuilder.generate('Sass', [input, output]);
  }

  less(input, output) {
    BalmBuilder.generate('Less', [input, output]);
  }

  csspath() {
    BalmBuilder.generate('Style');
  }

  // JavaScript

  js(entry, output) {
    BalmBuilder.generate('Js', [entry, output]);
  }

  jsmin(input, output, uglifyOptions = {}, renameOptions = { suffix: '.min' }) {
    BalmBuilder.generate('JsMin', [
      input,
      output,
      uglifyOptions,
      renameOptions
    ]);
  }

  // Files & Directories

  copy(input, output, renameOptions = {}) {
    BalmBuilder.generate('Copy', [input, output, renameOptions]);
  }

  remove(input) {
    BalmBuilder.generate('Remove', [input]);
  }

  // Cache

  version(input, output, options = []) {
    BalmBuilder.generate('Version', [input, output, options]);
  }

  // Server

  serve() {
    BalmBuilder.generate('Server');
  }

  // PWA
  generateSW() {
    BalmBuilder.generate('Pwa', 'generateSW');
  }

  injectManifest() {
    BalmBuilder.generate('Pwa', 'injectManifest');
  }

  // Assets

  zip(input = '', output = '', filename = 'archive.zip') {
    BalmBuilder.generate('Zip', [input, output, filename]);
  }

  ftp(localFiles, options = {}) {
    BalmBuilder.generate('Ftp', [localFiles, options]);
  }

  publish(input = '', output = '', renameOptions = {}) {
    BalmBuilder.generate('Publish', [input, output, renameOptions]);
  }
}

export default Api;
