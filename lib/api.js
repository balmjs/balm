import Builder from './helpers/builder';

class Api {
  // HTML

  html() {
    Builder.generate('Html', {});
  }

  // Stylesheets

  css(input, output) {
    Builder.generate('Css', { input, output });
  }

  sass(input, output) {
    Builder.generate('Sass', { input, output });
  }

  less(input, output) {
    Builder.generate('Less', { input, output });
  }

  csspath() {
    Builder.generate('Style', {});
  }

  cssmin(input, output, options = { suffix: '.min' }) {
    Builder.generate('CssMin', { input, output, options });
  }

  // JavaScript

  js(entry, output) {
    Builder.generate('Js', { input: entry, output });
  }

  jsmin(input, output, options = { suffix: '.min' }, tail = {}) {
    Builder.generate('JsMin', { input, output, options, tail });
  }

  // Files & Directories

  copy(input, output, options = {}) {
    Builder.generate('Copy', { input, output, options });
  }

  remove(input) {
    Builder.generate('Remove', { input });
  }

  // Cache

  version(input, output, options = []) {
    Builder.generate('Version', { input, output, options });
  }

  // Server

  serve() {
    Builder.generate('Server', {});
  }

  // Assets

  zip(input = '', output = '') {
    Builder.generate('Zip', { input, output });
  }

  ftp(input) {
    Builder.generate('Ftp', { input });
  }

  publish(input = '', output = '', options = {}) {
    Builder.generate('Publish', { input, output, options });
  }
}

export default Api;
