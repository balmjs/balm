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
  const normalized = filePath.replace(/\\/g, '/');
  const baseName = path.basename(normalized);
  for (const rawRule of rules) {
    if (typeof rawRule === 'string') {
      const rule = rawRule.replace(/\\/g, '/');
      const cleanRule = rule.replace(/^dist\//, '').replace(/^\.\/dist\//, '');
      if (
        normalized.endsWith(rule) ||
        normalized.endsWith(cleanRule) ||
        baseName === rule ||
        baseName === cleanRule ||
        baseName.endsWith(rule) ||
        picomatch.isMatch(normalized, rule) ||
        picomatch.isMatch(normalized, cleanRule) ||
        picomatch.isMatch(normalized, `**/${cleanRule}`) ||
        picomatch.isMatch(baseName, rule) ||
        picomatch.isMatch(baseName, cleanRule)
      ) {
        return true;
      }
    } else if (rawRule instanceof RegExp) {
      if (rawRule.test(normalized) || rawRule.test(baseName)) return true;
    }
  }
  return false;
}

export class AssetRevisioner {
  private options: CacheTransformOptions;
  private manifest: Record<string, string> = {};

  constructor(options: CacheTransformOptions = {}) {
    const baseDontRename = [
      '.html',
      'favicon.ico',
      'manifest.json',
      'robots.txt',
      '*.ico',
      'workbox-sw.js',
      'workbox-sw.js.map',
      'service-worker.js',
      'sw.js'
    ];
    this.options = {
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: baseDontRename,
      dontUpdateReference: [],
      hashLength: 8,
      ...options
    };
    if (options.dontRenameFile) {
      this.options.dontRenameFile = [
        ...baseDontRename,
        ...options.dontRenameFile
      ];
    }
  }

  process(files: VirtualFile[]): VirtualFile[] {
    const hashLength = this.options.hashLength || 8;
    const outputFiles: VirtualFile[] = [];

    // Phase 1: Calculate hashes and renames
    for (const file of files) {
      const origRelative = file.relative;
      file.revPathOriginal = file.path;

      // Check if file is already hashed (e.g. app.0e94aeee.js or chunk.22810145.js)
      const alreadyHashed = /\.[a-f0-9]{8}$/i.test(file.stem);

      const shouldRename =
        !alreadyHashed &&
        !matchesAny(file.path, this.options.dontRenameFile) &&
        !matchesAny(file.relative, this.options.dontRenameFile);

      if (shouldRename) {
        const fileHash = fsUtil.hash(file.contents, hashLength);
        const dir = path.dirname(file.path);
        const newFilename = `${file.stem}.${fileHash}${file.extname}`;
        file.path = path.join(dir, newFilename);
      }

      if (alreadyHashed) {
        const unhashedRelative = file.relative.replace(/\.[a-f0-9]{8}(\.[^.]+)$/i, '$1');
        this.manifest[unhashedRelative] = file.relative;
      }
      this.manifest[origRelative] = file.relative;
      outputFiles.push(file);
    }

    // Phase 2: Rewrite references
    const manifestEntries = Object.entries(this.manifest)
      .filter(([orig, reved]) => orig !== reved)
      .sort((a, b) => b[0].length - a[0].length);

    for (const file of outputFiles) {
      const shouldUpdate =
        !matchesAny(file.path, this.options.dontUpdateReference) &&
        !matchesAny(file.relative, this.options.dontUpdateReference);

      if (shouldUpdate && /\.(html|css|js)$/i.test(file.extname)) {
        let content = file.toString();
        for (const [orig, reved] of manifestEntries) {
          // Replace full relative path first
          content = content.replaceAll(orig, reved);

          // Replace basename with boundary check to avoid substring collision (e.g. .woff matching .woff2)
          const origBase = path.basename(orig);
          const revedBase = path.basename(reved);
          const escapedBase = origBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const baseRegex = new RegExp(`${escapedBase}(?![a-zA-Z0-9_])`, 'g');
          content = content.replace(baseRegex, revedBase);
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
