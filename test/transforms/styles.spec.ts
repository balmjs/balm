import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  Pipeline,
  transformSass,
  transformLess,
  transformPostcss,
  file as fsUtil
} from 'balm-core';
import path from 'node:path';

describe('Stylesheet Transforms', () => {
  const testDir = path.resolve(process.cwd(), '.tmp-test-styles');

  beforeEach(async () => {
    await fsUtil.ensureDir(testDir);
  });

  afterEach(async () => {
    await fsUtil.remove(testDir);
  });

  it('should compile SCSS with nested rules and variables', async () => {
    const scssPath = path.join(testDir, 'main.scss');
    await fsUtil.writeFile(scssPath, '$color: #ff0000; .box { color: $color; .inner { font-size: 14px; } }');

    const pipeline = Pipeline.from(scssPath, { cwd: testDir });
    pipeline.pipe(transformSass());
    const files = await pipeline.process();

    expect(files[0].extname).toBe('.css');
    expect(files[0].toString()).toContain('.box .inner');
    expect(files[0].toString()).toContain('#ff0000');
  });

  it('should compile Less files', async () => {
    const lessPath = path.join(testDir, 'main.less');
    await fsUtil.writeFile(lessPath, '@primary: #0088cc; .nav { background: @primary; }');

    const pipeline = Pipeline.from(lessPath, { cwd: testDir });
    pipeline.pipe(transformLess());
    const files = await pipeline.process();

    expect(files[0].extname).toBe('.css');
    expect(files[0].toString()).toContain('#0088cc');
  });

  it('should process and minify CSS with PostCSS and autoprefixer', async () => {
    const cssPath = path.join(testDir, 'main.css');
    await fsUtil.writeFile(cssPath, '.flex-box { display: flex; user-select: none; }');

    const pipeline = Pipeline.from(cssPath, { cwd: testDir });
    pipeline.pipe(transformPostcss({ minify: true }));
    const files = await pipeline.process();

    expect(files[0].toString()).toContain('display:flex');
  });
});
