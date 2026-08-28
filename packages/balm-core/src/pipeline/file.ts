import path from 'node:path';

export interface VirtualFileOptions {
  cwd: string;
  base: string;
  path: string;
  contents: Buffer | string;
}

export class VirtualFile {
  cwd: string;
  base: string;
  path: string;
  contents: Buffer;
  revPathOriginal?: string;

  constructor(options: VirtualFileOptions) {
    this.cwd = options.cwd;
    this.base = options.base;
    this.path = options.path;
    this.contents = typeof options.contents === 'string'
      ? Buffer.from(options.contents)
      : options.contents;
  }

  get relative(): string {
    return path.relative(this.base, this.path);
  }

  get extname(): string {
    return path.extname(this.path);
  }
  set extname(val: string) {
    const dir = path.dirname(this.path);
    const basename = path.basename(this.path, this.extname);
    this.path = path.join(dir, `${basename}${val.startsWith('.') ? val : `.${val}`}`);
  }

  get basename(): string {
    return path.basename(this.path);
  }
  set basename(val: string) {
    const dir = path.dirname(this.path);
    this.path = path.join(dir, val);
  }

  get stem(): string {
    return path.basename(this.path, this.extname);
  }
  set stem(val: string) {
    const dir = path.dirname(this.path);
    this.path = path.join(dir, `${val}${this.extname}`);
  }

  toString(encoding: BufferEncoding = 'utf8'): string {
    return this.contents.toString(encoding);
  }

  clone(): VirtualFile {
    const cloned = new VirtualFile({
      cwd: this.cwd,
      base: this.base,
      path: this.path,
      contents: Buffer.from(this.contents)
    });
    cloned.revPathOriginal = this.revPathOriginal;
    return cloned;
  }
}
