import Builder from './helpers/builder';

class Api {
  copy(input, output, options = {}) {
    Builder.generate('Copy', {input, output, options});
  }
  css(input, output) {
    Builder.generate('Css', {input, output});
  }
  sass(input, output) {
    Builder.generate('Sass', {input, output});
  }
  less(input, output) {
    Builder.generate('Less', {input, output});
  }
  cssmin(input, output, options = {suffix: '.min'}) {
    Builder.generate('CssMin', {input, output, options});
  }
  js(input, output) {
    Builder.generate('Js', {input, output});
  }
  jsmin(input, output, options = {suffix: '.min'}, tail = {}) {
    Builder.generate('JsMin', {input, output, options, tail});
  }
  zip(input = '', output = '') {
    Builder.generate('Zip', {input, output});
  }
  ftp(input) {
    Builder.generate('Ftp', {input});
  }
  publish(input = '', output = '', options = {}) {
    Builder.generate('Publish', {input, output, options});
  }
  version(input, output, options = {}) {
    Builder.generate('Version', {input, output, options});
  }
  remove(input) {
    Builder.generate('Remove', {input});
  }
}

export default Api;
