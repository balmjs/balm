// Absolute path
const getOutputPath = output => {
  let outputPath = config.production
    ? path.join(config.workspace, config.roots.target, config.paths.target.base)
    : path.join(config.workspace, config.roots.tmp, config.paths.tmp.base);

  if (output) {
    outputPath = File.absPaths(output);
  }

  return outputPath;
};

export default getOutputPath;
