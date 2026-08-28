import path from 'node:path';
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
    const templateDir = config.scripts.injectHtml
      ? config.src.base
      : config.src.html;

    const pattern = path.join(templateDir, '*.html');
    const pipeline = Pipeline.from(pattern, {
      cwd: config.workspace,
      base: templateDir
    });

    // Replace %PUBLIC_URL% placeholder
    const publicUrlReplacement = config.assets.virtualDir ? `/${config.assets.virtualDir}` : '';
    pipeline.pipe(transformReplace(new RegExp(PUBLIC_URL, 'g'), publicUrlReplacement));

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
