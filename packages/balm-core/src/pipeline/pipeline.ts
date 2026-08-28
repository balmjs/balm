import path from 'node:path';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { VirtualFile } from './file.js';
import { file as fsUtil } from '../utilities/file.js';

export type TransformFn = (
  file: VirtualFile
) => Promise<VirtualFile | VirtualFile[] | null | void> | VirtualFile | VirtualFile[] | null | void;

export interface PipelineOptions {
  cwd?: string;
  base?: string;
  allowEmpty?: boolean;
}

export class Pipeline {
  private cwd: string;
  private base?: string;
  private allowEmpty: boolean;
  private files: VirtualFile[] = [];
  private transforms: TransformFn[] = [];

  constructor(options: PipelineOptions = {}) {
    this.cwd = options.cwd || process.cwd();
    this.base = options.base;
    this.allowEmpty = options.allowEmpty ?? true;
  }

  static from(
    patterns: string | string[],
    options: PipelineOptions = {}
  ): Pipeline {
    const pipeline = new Pipeline(options);
    return pipeline.src(patterns);
  }

  src(patterns: string | string[], options: PipelineOptions = {}): this {
    if (options.cwd) this.cwd = options.cwd;
    if (options.base) this.base = options.base;
    if (options.allowEmpty !== undefined) this.allowEmpty = options.allowEmpty;

    this.transforms.push(async () => {
      const matched = await fg(patterns, {
        cwd: this.cwd,
        absolute: true,
        dot: true,
        onlyFiles: true
      });

      if (!matched.length && !this.allowEmpty) {
        throw new Error(`File not found with pattern: ${patterns}`);
      }

      // Calculate common base if not explicitly provided
      let effectiveBase = this.base;
      if (!effectiveBase) {
        const patternArr = Array.isArray(patterns) ? patterns : [patterns];
        const firstPos = patternArr.find((p) => !p.startsWith('!'));
        if (firstPos) {
          const globIdx = firstPos.indexOf('*');
          if (globIdx !== -1) {
            effectiveBase = path.resolve(this.cwd, firstPos.slice(0, globIdx));
          } else {
            effectiveBase = path.resolve(this.cwd, path.dirname(firstPos));
          }
        } else {
          effectiveBase = this.cwd;
        }
      }

      this.files = await Promise.all(
        matched.map(async (filePath) => {
          const buffer = await fs.readFile(filePath);
          return new VirtualFile({
            cwd: this.cwd,
            base: effectiveBase!,
            path: filePath,
            contents: buffer
          });
        })
      );
    });

    return this;
  }

  pipe(transform: TransformFn): this {
    this.transforms.push(transform);
    return this;
  }

  async process(): Promise<VirtualFile[]> {
    for (const transform of this.transforms) {
      if (this.files.length === 0) {
        // Initial src loader
        await transform(null as any);
      } else {
        const nextFiles: VirtualFile[] = [];
        for (const file of this.files) {
          const result = await transform(file);
          if (result === undefined || result === file) {
            nextFiles.push(file);
          } else if (Array.isArray(result)) {
            nextFiles.push(...result);
          } else if (result !== null) {
            nextFiles.push(result);
          }
        }
        this.files = nextFiles;
      }
    }
    return this.files;
  }

  async dest(outDir: string): Promise<string[]> {
    const files = await this.process();
    const writtenPaths: string[] = [];
    const absOutDir = path.isAbsolute(outDir) ? outDir : path.resolve(this.cwd, outDir);

    for (const file of files) {
      const targetPath = path.resolve(absOutDir, file.relative);
      await fsUtil.writeFile(targetPath, file.contents);
      writtenPaths.push(targetPath);
    }

    return writtenPaths;
  }
}
