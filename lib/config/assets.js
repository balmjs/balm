const ASSET_CONFIG = {
  publicUrlPlaceholder: '%PUBLIC_URL%',
  publicUrl: '', // Replace `%PUBLIC_URL%/` in html templates (the same to `scripts.webpack.output.publicPath`)
  root: 'assets', // Remote project root simulation
  publicPath: 'public', // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
  subDir: '', // Public subdirectory
  options: {
    fileNameManifest: 'rev-manifest.json',
    dontRenameFile: [
      '.html', '.php'
    ],
    dontUpdateReference: ['.html', '.php']
  },
  includes: [],
  excludes: []
};

export default ASSET_CONFIG;
