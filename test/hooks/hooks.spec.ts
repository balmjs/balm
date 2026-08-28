import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import balm, { file as fsUtil } from 'balm-core';
import path from 'node:path';

describe('Mix Hooks Subsystem', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-hooks');

  beforeEach(async () => {
    balm.reset();
    await fsUtil.ensureDir(testWorkspace);
    balm.config = {
      workspace: testWorkspace,
      useDefaults: false
    };
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should support mix.copy() recipe', async () => {
    const src = path.join(testWorkspace, 'file.txt');
    const dest = path.join(testWorkspace, 'out');
    await fsUtil.writeFile(src, 'Copy Test');

    await balm.go((mix) => {
      mix.copy(src, dest);
    });

    expect(await fsUtil.exists(path.join(dest, 'file.txt'))).toBe(true);
  });

  it('should support mix.remove() recipe', async () => {
    const fileToRemove = path.join(testWorkspace, 'to-delete.txt');
    await fsUtil.writeFile(fileToRemove, 'Delete Me');

    await balm.go((mix) => {
      mix.remove(fileToRemove);
    });

    expect(await fsUtil.exists(fileToRemove)).toBe(false);
  });

  it('should support mix.replace() recipe', async () => {
    const src = path.join(testWorkspace, 'source.txt');
    const dest = path.join(testWorkspace, 'dest');
    await fsUtil.writeFile(src, 'Hello WORLD');

    await balm.go((mix) => {
      mix.replace(src, dest, { substr: 'WORLD', replacement: 'Balm 6' });
    });

    const content = await fsUtil.readFile(path.join(dest, 'source.txt'));
    expect(content).toBe('Hello Balm 6');
  });

  it('should support mix.zip() recipe', async () => {
    const src = path.join(testWorkspace, 'content.txt');
    await fsUtil.writeFile(src, 'Compressible Content');

    await balm.go((mix) => {
      mix.zip(src, testWorkspace, 'test.zip');
    });

    expect(await fsUtil.exists(path.join(testWorkspace, 'test.zip'))).toBe(true);
  });
});
