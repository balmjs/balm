import path from 'node:path';
import { existsSync } from 'node:fs';
import fg from 'fast-glob';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformHtmlmin } from '../pipeline/transforms/htmlmin.js';
import {
  isManifestFile,
  rewriteHtmlAssetPaths,
  shouldUseTargetPaths
} from '../pipeline/transforms/url.js';
import { transformReplace } from '../pipeline/transforms/replace.js';
import { PUBLIC_URL } from '../config/constants.js';

const LIVE_RELOAD_SCRIPT = `
<!-- BalmJS Live Reload -->
<script>
(() => {
  if (window.__BALM_LIVE_RELOAD__) return;
  window.__BALM_LIVE_RELOAD__ = true;

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = \`\${protocol}//\${location.host}/__balm_ws\`;
  let ws = null;
  let reconnectTimer = null;
  let syncTimeout = null;
  let retryDelay = 500;
  let serverId = null;
  let lastBuildVersion = null;
  let reloading = false;

  const clearTimers = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
  };

  const triggerReload = (reason) => {
    if (reloading) return;
    reloading = true;
    clearTimers();
    console.log(\`[BalmJS] Reloading page (\${reason})...\`);
    location.reload();
  };

  const reloadLocalStylesheets = () => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const stamp = Date.now().toString();
    for (const link of links) {
      if (!link.href || link.dataset.balmStale === '1') continue;
      let url;
      try {
        url = new URL(link.href, location.href);
      } catch {
        continue;
      }
      if (url.origin !== location.origin) continue;
      url.searchParams.set('_balm_t', stamp);

      const next = link.cloneNode(false);
      next.href = url.href;
      link.dataset.balmStale = '1';
      const cleanupOld = () => {
        if (link.parentNode) link.parentNode.removeChild(link);
      };
      next.addEventListener('load', cleanupOld, { once: true });
      next.addEventListener('error', cleanupOld, { once: true });
      if (link.parentNode) {
        link.parentNode.insertBefore(next, link.nextSibling);
      }
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimer || reloading) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 3000);
  };

  const connect = () => {
    if (reloading) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      ws = new WebSocket(wsUrl);
    } catch {
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      retryDelay = 500;
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (syncTimeout) {
          clearTimeout(syncTimeout);
          syncTimeout = null;
        }
        if (msg.type === 'connected') {
          if (serverId !== null && msg.serverId && msg.serverId !== serverId) {
            triggerReload('server restarted');
            return;
          }
          if (
            lastBuildVersion !== null &&
            typeof msg.buildVersion === 'number' &&
            msg.buildVersion > lastBuildVersion
          ) {
            triggerReload('missed rebuild');
            return;
          }
          if (msg.serverId) serverId = msg.serverId;
          if (typeof msg.buildVersion === 'number') lastBuildVersion = msg.buildVersion;
        } else if (msg.type === 'reload') {
          if (typeof msg.buildVersion === 'number') lastBuildVersion = msg.buildVersion;
          triggerReload('file changed');
        } else if (msg.type === 'reload-css') {
          if (typeof msg.buildVersion === 'number') lastBuildVersion = msg.buildVersion;
          console.log('[BalmJS] Reloading CSS...');
          reloadLocalStylesheets();
        }
      } catch {}
    };

    ws.onerror = () => {
      try {
        ws?.close();
      } catch {}
    };

    ws.onclose = () => {
      ws = null;
      if (syncTimeout) {
        clearTimeout(syncTimeout);
        syncTimeout = null;
      }
      scheduleReconnect();
    };
  };

  const syncOrReconnect = () => {
    if (reloading) return;
    retryDelay = 500;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'sync' }));
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          syncTimeout = null;
          try {
            ws?.close();
          } catch {}
          ws = null;
          connect();
        }, 1500);
        return;
      } catch {}
    }
    connect();
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncOrReconnect();
    }
  });

  window.addEventListener('online', syncOrReconnect);

  connect();
})();
</script>
`;

function shouldDecorateEntryHtml(
  file: { extname: string; basename: string },
  isAuxiliary: boolean
): boolean {
  return (
    /\.html$/i.test(file.extname) &&
    !isAuxiliary &&
    file.basename.toLowerCase() !== '404.html'
  );
}

function getTemplatePatterns(templateDir: string, config: BalmConfig): string[] {
  const patterns = [path.join(templateDir, '*.html')];
  if (config.pwa.manifest) {
    const manifestPattern = path.join(templateDir, config.pwa.manifest);
    const resolvedManifest = path.isAbsolute(manifestPattern)
      ? manifestPattern
      : path.join(config.workspace, manifestPattern);
    if (existsSync(resolvedManifest)) {
      patterns.push(manifestPattern);
    }
  }
  return patterns;
}

function injectEntryScripts(content: string, config: BalmConfig): string {
  const entryNames =
    typeof config.scripts.entry === 'object' && !Array.isArray(config.scripts.entry)
      ? Object.keys(config.scripts.entry)
      : ['main'];
  const vendorName = config.scripts.vendorName || 'vendor';
  const entries = config.scripts.extractAllVendors
    ? [vendorName, ...entryNames]
    : entryNames;

  const jsDir = config.env.isProd ? config.paths.target.js : config.paths.tmp.js;
  const jsPathPrefix = config.assets.virtualDir
    ? `/${config.assets.virtualDir}/${jsDir}`
    : `/${jsDir}`;
  const destJsFolder = config.dest.js;

  const scriptTags = entries
    .filter(
      (entryName) =>
        !new RegExp(`<script[^>]+src=["'][^"']*${entryName}[^"']*\\.js["']`, 'i').test(
          content
        )
    )
    .map((entryName) => {
      let actualFilename = `${entryName}.js`;
      const hasUnhashed = existsSync(path.join(destJsFolder, actualFilename));
      let found = hasUnhashed;
      try {
        const matched = fg.sync(`${entryName}.*.js`, { cwd: destJsFolder });
        if (matched.length) {
          const valid = matched.find((f) => !f.endsWith('.map') && !f.endsWith('.txt'));
          if (valid) {
            actualFilename = valid;
            found = true;
          }
        }
      } catch {}
      if (entryName === vendorName && config.scripts.extractAllVendors && !found) {
        return '';
      }
      return `<script defer src="${jsPathPrefix}/${actualFilename}"></script>`;
    })
    .filter(Boolean)
    .join('\n');

  if (!scriptTags) {
    return content;
  }

  return content.includes('</body>')
    ? content.replace('</body>', `${scriptTags}\n</body>`)
    : `${content}\n${scriptTags}`;
}

function injectAnalytics(content: string, config: BalmConfig): string {
  const { custom, google } = config.html.analytics!;
  let nextContent = content;

  // 1. Custom analytics -> inject before </head>
  if (custom && custom.src) {
    const attrs = [
      `src="${custom.src}"`,
      custom.siteId !== undefined ? `data-website-id="${custom.siteId}"` : '',
      custom.defer !== false ? 'defer' : '',
      custom.async ? 'async' : ''
    ]
      .filter(Boolean)
      .join(' ');
    const customTag = `<script ${attrs}></script>`;

    nextContent = nextContent.includes('</head>')
      ? nextContent.replace('</head>', `  ${customTag}\n</head>`)
      : `${customTag}\n${nextContent}`;
  }

  // 2. Google Analytics -> inject before </body>
  if (google) {
    const gaSnippet = [
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${google}"></script>`,
      '<script>',
      '  window.dataLayer = window.dataLayer || [];',
      '  function gtag(){dataLayer.push(arguments);}',
      '  gtag(\'js\', new Date());',
      `  gtag('config', '${google}');`,
      '</script>'
    ].join('\n');

    nextContent = nextContent.includes('</body>')
      ? nextContent.replace('</body>', `${gaSnippet}\n</body>`)
      : `${nextContent}\n${gaSnippet}`;
  }

  return nextContent;
}

async function processHtmlPipeline(
  pipeline: Pipeline,
  config: BalmConfig,
  isAuxiliary: boolean
): Promise<void> {
  // Replace %PUBLIC_URL% placeholder
  const publicUrlReplacement = config.assets.virtualDir
    ? `/${config.assets.virtualDir}`
    : '';
  pipeline.pipe(transformReplace(new RegExp(PUBLIC_URL, 'g'), publicUrlReplacement));

  // In production or backend mode, map source paths to target paths in HTML and manifests
  if (shouldUseTargetPaths(config)) {
    pipeline.pipe(async (file) => {
      if (/\.html$/i.test(file.extname) || isManifestFile(file, config)) {
        file.contents = Buffer.from(rewriteHtmlAssetPaths(file.toString(), config));
      }
      return file;
    });
  }

  // Auto-inject script tags for entry HTML files
  if (config.scripts.injectHtml) {
    pipeline.pipe(async (file) => {
      if (shouldDecorateEntryHtml(file, isAuxiliary)) {
        const updated = injectEntryScripts(file.toString(), config);
        file.contents = Buffer.from(updated);
      }
      return file;
    });
  }

  // In production, inject analytics into entry HTML files if configured
  if (config.env.isProd && config.html.analytics) {
    pipeline.pipe(async (file) => {
      if (shouldDecorateEntryHtml(file, isAuxiliary)) {
        const updated = injectAnalytics(file.toString(), config);
        file.contents = Buffer.from(updated);
      }
      return file;
    });
  }

  if (config.env.isProd) {
    pipeline.pipe(transformHtmlmin(config.html.options));
  } else {
    pipeline.pipe(async (file) => {
      if (shouldDecorateEntryHtml(file, isAuxiliary)) {
        const content = file.toString();
        const updated = content.includes('</body>')
          ? content.replace('</body>', `${LIVE_RELOAD_SCRIPT}\n</body>`)
          : `${content}\n${LIVE_RELOAD_SCRIPT}`;
        file.contents = Buffer.from(updated);
      }
      return file;
    });
  }

  await pipeline.dest(config.dest.html);
}

export class HtmlTask extends BaseTask {
  constructor() {
    super({ name: 'html', description: 'Process HTML templates' });
  }

  async run(config: BalmConfig): Promise<void> {
    const customTemplate = config.scripts.htmlPluginOptions?.template;
    const customFilename = config.scripts.htmlPluginOptions?.filename;
    const outputBasename =
      typeof customFilename === 'string' && customFilename.trim()
        ? path.basename(customFilename)
        : 'index.html';
    const templateDir = config.scripts.injectHtml ? config.src.base : config.src.html;

    if (customTemplate) {
      const resolvedTemplatePath = path.resolve(config.workspace, customTemplate);
      const entryPipeline = Pipeline.from(resolvedTemplatePath, {
        cwd: config.workspace,
        base: path.dirname(resolvedTemplatePath)
      });

      entryPipeline.pipe(async (file) => {
        file.basename = outputBasename;
        return file;
      });

      await processHtmlPipeline(entryPipeline, config, false);

      // Process auxiliary HTML files (e.g., 404.html) in templateDir without entry scripts
      const auxPatterns = getTemplatePatterns(templateDir, config);
      const auxPipeline = Pipeline.from(auxPatterns, {
        cwd: config.workspace,
        base: templateDir
      });

      auxPipeline.pipe(async (file) => {
        if (
          path.resolve(file.path) === resolvedTemplatePath ||
          file.basename.toLowerCase() === outputBasename.toLowerCase()
        ) {
          return null;
        }
        return file;
      });

      await processHtmlPipeline(auxPipeline, config, true);
    } else {
      const patterns = getTemplatePatterns(templateDir, config);
      const pipeline = Pipeline.from(patterns, {
        cwd: config.workspace,
        base: templateDir
      });

      await processHtmlPipeline(pipeline, config, false);
    }
  }
}
