import path from 'node:path';
import fg from 'fast-glob';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformHtmlmin } from '../pipeline/transforms/htmlmin.js';
import { transformReplace } from '../pipeline/transforms/replace.js';
import { PUBLIC_URL } from '../config/constants.js';

const LIVE_RELOAD_SCRIPT = `
<!-- BalmJS Live Reload -->
<script>
(() => {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(\`\${protocol}//\${location.host}/__balm_ws\`);
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'reload') {
        console.log('[BalmJS] Reloading page...');
        location.reload();
      } else if (msg.type === 'reload-css') {
        console.log('[BalmJS] Reloading CSS...');
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const link of links) {
          const url = new URL(link.href);
          url.searchParams.set('_balm_t', Date.now().toString());
          link.href = url.href;
        }
      }
    } catch {}
  };
  ws.onclose = () => {
    setTimeout(() => location.reload(), 2000);
  };
})();
</script>
`;

export class HtmlTask extends BaseTask {
  constructor() {
    super({ name: 'html', description: 'Process HTML templates' });
  }

  async run(config: BalmConfig): Promise<void> {
    const customTemplate = config.scripts.htmlPluginOptions?.template;
    let pipeline: Pipeline;

    if (customTemplate) {
      const templatePath = path.isAbsolute(customTemplate)
        ? customTemplate
        : path.join(config.workspace, customTemplate);
      pipeline = Pipeline.from(templatePath, {
        cwd: config.workspace,
        base: path.dirname(templatePath)
      });
    } else {
      const templateDir = config.scripts.injectHtml
        ? config.src.base
        : config.src.html;

      const pattern = path.join(templateDir, '*.html');
      pipeline = Pipeline.from(pattern, {
        cwd: config.workspace,
        base: templateDir
      });
    }

    // Replace %PUBLIC_URL% placeholder
    const publicUrlReplacement = config.assets.virtualDir ? `/${config.assets.virtualDir}` : '';
    pipeline.pipe(transformReplace(new RegExp(PUBLIC_URL, 'g'), publicUrlReplacement));

    // Ensure output filename is index.html if custom template was used
    if (customTemplate) {
      pipeline.pipe(async (file) => {
        file.basename = 'index.html';
        return file;
      });
    }

    // In production, map source paths to target paths in HTML
    if (config.env.isProd) {
      pipeline.pipe(async (file) => {
        if (/\.html$/i.test(file.extname)) {
          let content = file.toString();
          if (
            config.paths.source.css &&
            config.paths.target.css &&
            config.paths.source.css !== config.paths.target.css
          ) {
            content = content.replaceAll(
              `/${config.paths.source.css}/`,
              `/${config.paths.target.css}/`
            );
            content = content.replaceAll(
              `"${config.paths.source.css}/`,
              `"${config.paths.target.css}/`
            );
            content = content.replaceAll(
              `'${config.paths.source.css}/`,
              `'${config.paths.target.css}/`
            );
          }
          if (
            config.paths.source.js &&
            config.paths.target.js &&
            config.paths.source.js !== config.paths.target.js
          ) {
            content = content.replaceAll(
              `/${config.paths.source.js}/`,
              `/${config.paths.target.js}/`
            );
            content = content.replaceAll(
              `"${config.paths.source.js}/`,
              `"${config.paths.target.js}/`
            );
            content = content.replaceAll(
              `'${config.paths.source.js}/`,
              `'${config.paths.target.js}/`
            );
          }
          if (
            config.paths.source.img &&
            config.paths.target.img &&
            config.paths.source.img !== config.paths.target.img
          ) {
            content = content.replaceAll(
              `/${config.paths.source.img}/`,
              `/${config.paths.target.img}/`
            );
            content = content.replaceAll(
              `"${config.paths.source.img}/`,
              `"${config.paths.target.img}/`
            );
            content = content.replaceAll(
              `'${config.paths.source.img}/`,
              `'${config.paths.target.img}/`
            );
          }
          if (
            config.paths.source.font &&
            config.paths.target.font &&
            config.paths.source.font !== config.paths.target.font
          ) {
            content = content.replaceAll(
              `/${config.paths.source.font}/`,
              `/${config.paths.target.font}/`
            );
            content = content.replaceAll(
              `"${config.paths.source.font}/`,
              `"${config.paths.target.font}/`
            );
            content = content.replaceAll(
              `'${config.paths.source.font}/`,
              `'${config.paths.target.font}/`
            );
          }
          file.contents = Buffer.from(content);
        }
        return file;
      });
    }

    // Auto-inject script tags if injectHtml is enabled
    if (config.scripts.injectHtml) {
      pipeline.pipe(async (file) => {
        if (/\.html$/i.test(file.extname)) {
          let content = file.toString();
          const entries =
            typeof config.scripts.entry === 'object' && !Array.isArray(config.scripts.entry)
              ? Object.keys(config.scripts.entry)
              : ['main'];

          const jsDir = config.env.isProd ? config.paths.target.js : config.paths.tmp.js;
          const jsPathPrefix = config.assets.virtualDir ? `/${config.assets.virtualDir}/${jsDir}` : `/${jsDir}`;
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
              try {
                const matched = fg.sync(`${entryName}.*.js`, { cwd: destJsFolder });
                if (matched.length) {
                  const valid = matched.find((f) => !f.endsWith('.map') && !f.endsWith('.txt'));
                  if (valid) {
                    actualFilename = valid;
                  }
                }
              } catch {}
              return `<script defer src="${jsPathPrefix}/${actualFilename}"></script>`;
            })
            .join('\n');

          if (scriptTags) {
            if (content.includes('</body>')) {
              content = content.replace('</body>', `${scriptTags}\n</body>`);
            } else {
              content += `\n${scriptTags}`;
            }
            file.contents = Buffer.from(content);
          }
        }
        return file;
      });
    }

    if (config.env.isProd) {
      pipeline.pipe(transformHtmlmin(config.html.options));
    } else {
      pipeline.pipe(async (file) => {
        if (/\.html$/i.test(file.extname)) {
          let content = file.toString();
          if (content.includes('</body>')) {
            content = content.replace('</body>', `${LIVE_RELOAD_SCRIPT}\n</body>`);
          } else {
            content += `\n${LIVE_RELOAD_SCRIPT}`;
          }
          file.contents = Buffer.from(content);
        }
        return file;
      });
    }

    await pipeline.dest(config.dest.html);
  }
}
