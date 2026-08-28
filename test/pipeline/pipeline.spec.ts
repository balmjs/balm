import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  Pipeline,
  transformReplace,
  transformRename,
  file as fsUtil
} from 'balm-core';
import path from 'node:path';

describe('Pipeline Subsystem', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-pipeline');

  beforeEach(async () => {
    await fsUtil.ensureDir(testWorkspace);
    await fsUtil.writeFile(path.join(testWorkspace, 'app.js'), 'const version = "%VERSION%";');
    await fsUtil.writeFile(path.join(testWorkspace, 'template.html'), '<h1>%TITLE%</h1>');
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should stream files and apply replace transforms', async () => {
    const pipeline = Pipeline.from(path.join(testWorkspace, 'app.js'), { cwd: testWorkspace });
    pipeline.pipe(transformReplace('%VERSION%', '6.0.0'));
    const files = await pipeline.process();

    expect(files).toHaveLength(1);
    expect(files[0].toString()).toBe('const version = "6.0.0";');
  });

  it('should rename output files using transformRename', async () => {
    const pipeline = Pipeline.from(path.join(testWorkspace, 'app.js'), { cwd: testWorkspace });
    pipeline.pipe(transformRename({ suffix: '.min' }));
    const files = await pipeline.process();

    expect(files[0].basename).toBe('app.min.js');
  });

  it('should write transformed files to destination directory', async () => {
    const outDir = path.join(testWorkspace, 'dist');
    const pipeline = Pipeline.from(path.join(testWorkspace, '*.html'), { cwd: testWorkspace });
    pipeline.pipe(transformReplace('%TITLE%', 'BalmJS Next'));

    const written = await pipeline.dest(outDir);
    expect(written.length).toBe(1);

    const content = await fsUtil.readFile(path.join(outDir, 'template.html'));
    expect(content).toBe('<h1>BalmJS Next</h1>');
  });
});
