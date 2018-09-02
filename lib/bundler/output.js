// Absolute path
const getOutputPath = output => {
  let outputPath = config.production ? config.target.base : config.tmp.base;

  return output ? File.absPaths(output) : outputPath;
};

export default getOutputPath;
