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
      '*.webmanifest',
      'robots.txt',
      '*.ico',
      '*.map',
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
    this.manifest = {};
    const hashLength = this.options.hashLength || 8;
    const alreadyHashedRegex =
      hashLength === 8
        ? /\.[a-f0-9]{8}$/i
        : new RegExp(`\\.(?:[a-f0-9]{8}|[a-f0-9]{${hashLength}})$`, 'i');
    const alreadyHashedExtRegex =
      hashLength === 8
        ? /\.[a-f0-9]{8}(\.[^.]+)$/i
        : new RegExp(`\\.(?:[a-f0-9]{8}|[a-f0-9]{${hashLength}})(\\.[^.]+)$`, 'i');

    const outputFiles: VirtualFile[] = [];
    const renames: Array<[string, string]> = [];
    const renamedOrigs = new Set<string>();
    const alreadyHashedUniques = new Map<string, string | null>();

    // Phase 1: Calculate hashes and renames
    for (const file of files) {
      const origRelative = file.relative.replace(/\\/g, '/');
      file.revPathOriginal = file.path;

      // Check if file is already hashed by a bundler (e.g. app.0e94aeee.js or 1.859e0c2f.jpg)
      const alreadyHashed = alreadyHashedRegex.test(file.stem);

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

      const revedRelative = file.relative.replace(/\\/g, '/');
      if (alreadyHashed) {
        const unhashedRelative = revedRelative.replace(alreadyHashedExtRegex, '$1');
        alreadyHashedUniques.set(
          unhashedRelative,
          alreadyHashedUniques.has(unhashedRelative) ? null : revedRelative
        );
      } else if (origRelative !== revedRelative) {
        renames.push([origRelative, revedRelative]);
        renamedOrigs.add(origRelative);
      }

      this.manifest[origRelative] = revedRelative;
      outputFiles.push(file);
    }

    // Phase 2: Build single-pass replacement lookup (full paths + unambiguous basenames)
    const lookup = new Map<string, string>();
    for (const [unhashedRelative, revedRelative] of alreadyHashedUniques) {
      if (
        revedRelative &&
        !renamedOrigs.has(unhashedRelative) &&
        unhashedRelative !== revedRelative
      ) {
        this.manifest[unhashedRelative] = revedRelative;
        lookup.set(unhashedRelative, revedRelative);
      }
    }

    const basenameCounts = new Map<string, number>();
    for (const [orig] of renames) {
      const base = path.posix.basename(orig);
      basenameCounts.set(base, (basenameCounts.get(base) || 0) + 1);
    }

    for (const [orig, reved] of renames) {
      const origBase = path.posix.basename(orig);
      const revedBase = path.posix.basename(reved);
      if (basenameCounts.get(origBase) === 1 && !lookup.has(origBase)) {
        lookup.set(origBase, revedBase);
      }
    }

    for (const [orig, reved] of renames) {
      lookup.set(orig, reved);
    }

    if (lookup.size > 0) {
      const patterns = [...lookup.keys()]
        .sort((a, b) => b.length - a.length)
        .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const replaceRegex = new RegExp(
        `(?<![a-zA-Z0-9_.@-])(?:${patterns.join('|')})(?![a-zA-Z0-9_.@-])`,
        'g'
      );

      for (const file of outputFiles) {
        const shouldUpdate =
          !matchesAny(file.path, this.options.dontUpdateReference) &&
          !matchesAny(file.relative, this.options.dontUpdateReference);

        if (shouldUpdate && /\.(html|css|js)$/i.test(file.extname)) {
          const content = file.toString();
          const updated = content.replace(replaceRegex, (matched) => lookup.get(matched) || matched);
          if (updated !== content) {
            file.contents = Buffer.from(updated);
          }
        }
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
