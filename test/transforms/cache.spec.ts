import { describe, it, expect } from 'vitest';
import { AssetRevisioner, VirtualFile } from 'balm-core';
import path from 'node:path';

describe('Asset Revisioning & Cache Subsystem', () => {
  it('should hash assets, rewrite references in HTML/CSS, and generate manifest', () => {
    const base = '/test-app/dist';
    const cssFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'css', 'app.css'),
      contents: 'body { background: url("../img/logo.png"); }'
    });

    const imgFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', 'logo.png'),
      contents: 'binary-image-data'
    });

    const htmlFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'index.html'),
      contents: '<link rel="stylesheet" href="css/app.css"><img src="img/logo.png">'
    });

    const revisioner = new AssetRevisioner({
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: ['.html'],
      dontUpdateReference: []
    });

    const outputs = revisioner.process([cssFile, imgFile, htmlFile]);

    // Manifest should be created
    const manifestFile = outputs.find((f) => f.basename === 'rev-manifest.json');
    expect(manifestFile).toBeDefined();

    const manifest = JSON.parse(manifestFile!.toString());
    expect(manifest['img/logo.png']).toMatch(/img\/logo\.[a-f0-9]{8}\.png/);
    expect(manifest['css/app.css']).toMatch(/css\/app\.[a-f0-9]{8}\.css/);

    // HTML should reference new revised hashed filenames
    const outputHtml = outputs.find((f) => f.basename === 'index.html');
    expect(outputHtml!.toString()).not.toContain('logo.png');
    expect(outputHtml!.toString()).toMatch(/logo\.[a-f0-9]{8}\.png/);
  });
});
