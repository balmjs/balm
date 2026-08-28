import path from 'node:path';
import picomatch from 'picomatch';
import { VirtualFile } from '../file.js';
import { file as fsUtil } from '../../utilities/file.js';

export interface CacheTransformOptions {
  fileNameManifest?: string;
  dontRenameFile?: (string | RegExp)[];
  dontUpdateReference?: (string | RegExp)[];
  hashLength?: number;
  [key: string]: any;
}

function matchesAny(filePath: string, rules?: (string | RegExp)[]): boolean {
  if (!rules || !rules.length) return false;
  for (const rule of rules) {
    if (typeof rule === 'string') {
      if (filePath.endsWith(rule) || picomatch.isMatch(filePath, rule)) {
        return true;
      }
    } else if (rule instanceof RegExp) {
      if (rule.test(filePath)) return true;
    }
  }
  return false;
}

export class AssetRevisioner {
  private options: CacheTransformOptions;
  private manifest: Record<string, string> = {};

  constructor(options: CacheTransformOptions = {}) {
    this.options = {
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: ['.html'],
      dontUpdateReference: [],
      hashLength: 8,
      ...options
    };
  }

  process(files: VirtualFile[]): VirtualFile[] {
    const hashLength = this.options.hashLength || 8;
    const outputFiles: VirtualFile[] = [];

    // Phase 1: Calculate hashes and renames
    for (const file of files) {
      const origRelative = file.relative;
      file.revPathOriginal = file.path;

      const shouldRename = !matchesAny(file.path, this.options.dontRenameFile) &&
        !matchesAny(file.relative, this.options.dontRenameFile);

      if (shouldRename) {
        const fileHash = fsUtil.hash(file.contents, hashLength);
        const dir = path.dirname(file.path);
        const newFilename = `${file.stem}.${fileHash}${file.extname}`;
        file.path = path.join(dir, newFilename);
      }

      this.manifest[origRelative] = file.relative;
      outputFiles.push(file);
    }

    // Phase 2: Rewrite references
    for (const file of outputFiles) {
      const shouldUpdate = !matchesAny(file.path, this.options.dontUpdateReference) &&
        !matchesAny(file.relative, this.options.dontUpdateReference);

      if (shouldUpdate && /\.(html|css|js)$/i.test(file.extname)) {
        let content = file.toString();
        for (const [orig, reved] of Object.entries(this.manifest)) {
          if (orig !== reved) {
            const origBase = path.basename(orig);
            const revedBase = path.basename(reved);
            content = content.replaceAll(origBase, revedBase);
          }
        }
        file.contents = Buffer.from(content);
      }
    }

    // Phase 3: Add manifest file
    const manifestName = this.options.fileNameManifest || 'rev-manifest.json';
    const firstBase = files[0]?.base || process.cwd();
    const manifestFile = new VirtualFile({
      cwd: files[0]?.cwd || process.cwd(),
      base: firstBase,
      path: path.join(firstBase, manifestName),
      contents: JSON.stringify(this.manifest, null, 2)
    });
    outputFiles.push(manifestFile);

    return outputFiles;
  }
}
