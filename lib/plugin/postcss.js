const getProcessors = () => {
  let processors = [
    require('precss')(),
    require('autoprefixer')({browsers: config.styles.autoprefixer})
    // require('css-mqpacker')()
  ].concat(config.styles.postcss);

  return processors;
};

export default getProcessors;
