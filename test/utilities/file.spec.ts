import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { file } from 'balm-core';
import path from 'node:path';
import fs from 'node:fs/promises';

describe('FileSystem Utility', () => {
  const testDir = path.resolve(process.cwd(), '.tmp-test-fs');

  beforeEach(async () => {
    await file.ensureDir(testDir);
  });

  afterEach(async () => {
    await file.remove(testDir);
  });

  it('should write, check existence, and read files', async () => {
    const filePath = path.join(testDir, 'hello.txt');
    await file.writeFile(filePath, 'Hello Balm 6.x');

    const exists = await file.exists(filePath);
    expect(exists).toBe(true);

    const content = await file.readFile(filePath);
    expect(content).toBe('Hello Balm 6.x');
  });

  it('should copy files and directories recursively', async () => {
    const srcFile = path.join(testDir, 'source', 'sample.txt');
    const destFile = path.join(testDir, 'copied', 'sample.txt');

    await file.writeFile(srcFile, 'Copied Content');
    await file.copyFile(srcFile, destFile);

    expect(await file.readFile(destFile)).toBe('Copied Content');
  });

  it('should remove directories and multiple files safely', async () => {
    const dir = path.join(testDir, 'nested', 'deep');
    await file.ensureDir(dir);
    const fileA = path.join(dir, 'a.txt');
    await file.writeFile(fileA, 'A');

    const removed = await file.remove(path.join(testDir, 'nested'));
    expect(removed.length).toBeGreaterThan(0);
    expect(await file.exists(fileA)).toBe(false);
  });

  it('should compute consistent content hashes', () => {
    const hash1 = file.hash('BalmJS 6.x Rocks');
    const hash2 = file.hash('BalmJS 6.x Rocks');
    const hash3 = file.hash('Different Content');

    expect(hash1).toHaveLength(8);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });
});
