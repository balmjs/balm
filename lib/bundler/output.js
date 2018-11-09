// Absolute path
const getOutputPath = output => {
  let outputPath = config.production ? config.target.base : config.tmp.base;

  return output ? BalmFile.absPaths(output) : outputPath;
};

export default getOutputPath;
