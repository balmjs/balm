// Absolute path
const getOutputPath = output => {
  let outputPath = config.production ? config.target.base : config.tmp.base;

  if (output) {
    outputPath = File.absPaths(output);
  }

  return outputPath;
};

export default getOutputPath;
