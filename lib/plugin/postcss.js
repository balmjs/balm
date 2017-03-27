const getProcessors = () => {
  let processors = [
    require('precss')(),
    require('autoprefixer')({browsers: config.styles.autoprefixer})
  ].concat(config.styles.postcss);

  return processors;
};

export default getProcessors;
