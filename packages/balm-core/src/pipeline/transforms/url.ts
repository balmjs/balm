import path from 'node:path';
import { TransformFn } from '../pipeline.js';
import { BalmConfig } from '../../types/index.js';

const CSS_ASSET_TYPES = ['img', 'font', 'media'] as const;
const HTML_ASSET_TYPES = ['css', 'js', 'img', 'font', 'media'] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSegment(value?: string): string {
  return value ? value.replace(/^\/+|\/+$/g, '') : '';
}

export function shouldUseTargetPaths(config: BalmConfig): boolean {
  return Boolean(config.env?.isProd || !config.inFrontend);
}

/**
 * Check whether a file is the configured PWA manifest or a `.webmanifest` file.
 */
export function isManifestFile(
  file: { basename: string; extname: string },
  config: BalmConfig
): boolean {
  const manifestFilename = path.basename(config.pwa?.manifest || 'manifest.json');
  return (
    file.basename === manifestFilename ||
    file.extname.toLowerCase() === '.webmanifest'
  );
}

/**
 * Rewrite relative (`../<source>/`) and root-relative (`url(/<source>/)`)
 * asset URLs in compiled stylesheets from source folder names to target folder
 * names when building for production or backend integration.
 */
export function rewriteCssAssetUrls(content: string, config: BalmConfig): string {
  if (!shouldUseTargetPaths(config)) {
    return content;
  }

  let updated = content;

  for (const type of CSS_ASSET_TYPES) {
    const source = normalizeSegment(config.paths?.source?.[type]);
    const target = normalizeSegment(config.paths?.target?.[type]);
    if (!source || !target) continue;

    const sourceLeaf = source.split('/').pop();
    const candidates = Array.from(
      new Set(
        [source, sourceLeaf].filter(
          (item): item is string => Boolean(item && item !== target)
        )
      )
    ).sort((a, b) => b.length - a.length);

    if (!candidates.length) continue;

    const alternation = candidates.map(escapeRegExp).join('|');
    const relativeRegex = new RegExp(
      `(^|[\\s('",])((?:\\.{2}\\/)+)(?:${alternation})\\/`,
      'g'
    );
    updated = updated.replace(relativeRegex, `$1$2${target}/`);

    const rootUrlRegex = new RegExp(
      `(url\\(\\s*['"]?)\\/(?:${alternation})\\/`,
      'gi'
    );
    updated = updated.replace(rootUrlRegex, `$1/${target}/`);
  }

  return updated;
}

/**
 * Rewrite source directory segments (e.g. `/images/`, `"styles/`) to target
 * directory names in HTML and PWA manifest files.
 */
export function rewriteHtmlAssetPaths(content: string, config: BalmConfig): string {
  if (!shouldUseTargetPaths(config)) {
    return content;
  }

  const sourceMap = new Map<string, string>();
  for (const type of HTML_ASSET_TYPES) {
    const source = normalizeSegment(config.paths?.source?.[type]);
    const target = normalizeSegment(config.paths?.target?.[type]);
    if (source && target && source !== target) {
      sourceMap.set(source, target);
    }
  }

  if (!sourceMap.size) {
    return content;
  }

  const alternation = Array.from(sourceMap.keys())
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');

  const virtualDir = normalizeSegment(config.assets?.virtualDir);
  const virtualPrefix = virtualDir
    ? `\\/${escapeRegExp(virtualDir)}\\/|`
    : '';

  const prefixedRegex = new RegExp(
    `(^|["'\`=(,\\s])(${virtualPrefix}(?:\\.{1,2}\\/)+|\\/)(${alternation})\\/`,
    'g'
  );
  let updated = content.replace(
    prefixedRegex,
    (_, lead, prefix, src) => `${lead}${prefix}${sourceMap.get(src)}/`
  );

  const bareQuotedRegex = new RegExp(`(["'\`=])(${alternation})\\/`, 'g');
  updated = updated.replace(
    bareQuotedRegex,
    (_, lead, src) => `${lead}${sourceMap.get(src)}/`
  );

  return updated;
}

export function transformCssUrl(config: BalmConfig): TransformFn {
  return async (file) => {
    if (!/\.css$/i.test(file.extname)) return file;

    file.contents = Buffer.from(rewriteCssAssetUrls(file.toString(), config));
    return file;
  };
}
