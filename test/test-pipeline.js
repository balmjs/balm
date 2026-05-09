import fs from 'fs';
import imagemin from 'imagemin';

const loadPlugin = (plugin, ...args) => {
  return async (input) => {
    try {
      const m = await import(`imagemin-${plugin}`);
      const pluginFn = m.default(...args);
      return await pluginFn(input);
    } catch (err) {
      console.error(`Error loading plugin ${plugin}:`, err);
      return input;
    }
  };
};

const exposePlugin = (plugin) => (...args) => loadPlugin(plugin, ...args);

const gifsicle = exposePlugin('gifsicle');
const mozjpeg = exposePlugin('mozjpeg');
const optipng = exposePlugin('optipng');
const svgo = exposePlugin('svgo');

const plugins = [gifsicle(), mozjpeg(), optipng(), svgo()];

(async () => {
  try {
    const input = fs.readFileSync('test-workspace/src/images/logo.gif');
    console.log('Original size:', input.length);
    const data = await imagemin.buffer(input, { plugins });
    console.log('Optimized size:', data.length);
  } catch (err) {
    console.error('Error during pipeline:', err);
  }
})();
