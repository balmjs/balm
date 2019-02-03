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

  jsmin(input, output, options = {}, tail = { suffix: '.min' }) {
    BalmBuilder.generate('JsMin', [input, output, options, tail]);
  }

  // Files & Directories

  copy(input, output, options = {}) {
    BalmBuilder.generate('Copy', [input, output, options]);
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

  // Assets

  zip(input = '', output = '') {
    BalmBuilder.generate('Zip', [input, output]);
  }

  ftp(input, options = {}) {
    BalmBuilder.generate('Ftp', [input, options]);
  }

  publish(input = '', output = '', options = {}) {
    BalmBuilder.generate('Publish', [input, output, options]);
  }
}

export default Api;
