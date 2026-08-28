import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import fg from 'fast-glob';

export class FileSystem {
  workspace: string = process.cwd();

  resolveApp(...paths: string[]): string {
    return path.resolve(this.workspace, ...paths);
  }

  absPath(filePath: string): string {
    return path.isAbsolute(filePath) ? filePath : this.resolveApp(filePath);
  }

  absPaths(filePaths: string | string[]): string | string[] {
    if (Array.isArray(filePaths)) {
      return filePaths.map((p) => this.absPath(p));
    }
    return this.absPath(filePaths);
  }

  async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(this.absPath(targetPath));
      return true;
    } catch {
      return false;
    }
  }

  existsSync(targetPath: string): boolean {
    return existsSync(this.absPath(targetPath));
  }

  async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(this.absPath(dirPath), { recursive: true });
  }

  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return fs.readFile(this.absPath(filePath), { encoding });
  }

  async readBuffer(filePath: string): Promise<Buffer> {
    return fs.readFile(this.absPath(filePath));
  }

  async writeFile(filePath: string, data: string | Buffer): Promise<void> {
    const fullPath = this.absPath(filePath);
    await this.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, data);
  }

  async remove(targetPath: string | string[]): Promise<string[]> {
    const targets = Array.isArray(targetPath) ? targetPath : [targetPath];
    const removed: string[] = [];

    for (const item of targets) {
      const fullPath = this.absPath(item);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
        removed.push(fullPath);
      } catch {
        // file doesn't exist or already removed
      }
    }

    return removed;
  }

  async copyFile(src: string, dest: string): Promise<void> {
    const srcPath = this.absPath(src);
    const destPath = this.absPath(dest);
    await this.ensureDir(path.dirname(destPath));
    await fs.copyFile(srcPath, destPath);
  }

  async copyDir(srcDir: string, destDir: string): Promise<void> {
    const src = this.absPath(srcDir);
    const dest = this.absPath(destDir);
    await this.ensureDir(dest);

    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcItem = path.join(src, entry.name);
      const destItem = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await this.copyDir(srcItem, destItem);
      } else {
        await this.copyFile(srcItem, destItem);
      }
    }
  }

  async matchFiles(
    patterns: string | string[],
    options: fg.Options = {}
  ): Promise<string[]> {
    const defaultOptions: fg.Options = {
      cwd: this.workspace,
      absolute: true,
      dot: true,
      onlyFiles: true
    };
    return fg(patterns, { ...defaultOptions, ...options });
  }

  hash(content: string | Buffer, length = 8): string {
    return crypto.createHash('md5').update(content).digest('hex').slice(0, length);
  }
}

export const file = new FileSystem();
