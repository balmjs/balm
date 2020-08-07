import { BalmPath } from '@balm-core/index';

const source: BalmPath = {
  base: '', // Project directory
  html: '', // HTML template directory: `src`
  css: 'styles', // Stylesheet directory: `src/styles`
  js: 'scripts', // Javascript directory: `src/scripts`
  img: 'images', // Image directory: `src/images`
  font: 'fonts', // Font directory: `src/fonts`
  media: 'media' // Media directory: `src/media`
};

const tmp: Omit<BalmPath, 'html'> = {
  base: '', // `.tmp`
  css: 'css', // `.tmp/css`
  js: 'js', // `.tmp/js`
  img: 'img', // `.tmp/img`
  font: 'fonts', // `.tmp/fonts`
  media: 'media' // `.tmp/media`
};

const target: Omit<BalmPath, 'html'> = {
  base: '', // `dist`
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
