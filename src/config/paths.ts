const source: object = {
  base: '', // Project directory
  css: 'styles', // Stylesheet directory: `src/styles`
  js: 'scripts', // Javascript directory: `src/scripts`
  img: 'images', // Image directory: `src/images`
  font: 'fonts', // Font directory: `src/fonts`
  media: 'media' // Media directory: `src/media`
};

const tmp: object = {
  base: '',
  css: 'css', // `.tmp/css`
  js: 'js', // `.tmp/js`
  img: 'img', // `.tmp/img`
  font: 'fonts', // `.tmp/fonts`
  media: 'media' // `.tmp/media`
};

const target: object = {
  base: '',
  css: 'css', // `dist/css`
  js: 'js', // `dist/js`
  img: 'img', // `dist/img`
  font: 'font', // `dist/font`
  media: 'media' // `dist/media`
};

export default {
  source,
  tmp,
  target
};
