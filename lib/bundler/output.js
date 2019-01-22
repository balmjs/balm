// Absolute path
const getOutputPath = output => {
  let outputPath = config.isProd ? config.target.base : config.tmp.base;

  return output ? BalmFile.absPaths(output) : outputPath;
};

export default getOutputPath;
