import { MANIFEST } from '../../config/constants';

class HtmlTask extends BalmJS.BalmTask {
  constructor() {
    super('html');

    this.defaultInput = BalmJS.config.env.isProd
      ? [
          `${BalmJS.config.src.base}/*.html`,
          `${BalmJS.config.src.base}/${MANIFEST}`
        ]
      : `${BalmJS.config.src.base}/*.html`;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  getAssetsPath(type: any): any {
    const from = BalmJS.config.paths.source[type].split('/').pop();
    const to = BalmJS.file.assetsPath(BalmJS.config.paths.target[type]);

    const developmentPublicPath = new RegExp(
      `${BalmJS.config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    const productionPublicPath = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  getManifestPath(): any {
    const from = BalmJS.config.paths.source.img.split('/').pop();
    const to = BalmJS.file.assetsPath(BalmJS.config.paths.target.img);

    const developmentPublicPath = new RegExp(`/?${from}`, 'g');
    const productionPublicPath = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  fn(): void {
    this.init();

    let stream: any = gulp.src(BalmJS.file.absPaths(this.input), {
      allowEmpty: true
    });

    if (BalmJS.config.env.isProd) {
      stream = stream
        .pipe(
          $.useref({
            base: BalmJS.config.workspace,
            searchPath: [
              BalmJS.config.roots.tmp,
              BalmJS.config.roots.source,
              '.'
            ]
          })
        )
        .pipe($.if(/\.html$/, $.htmlmin(BalmJS.config.html.options)))
        .pipe(this.getAssetsPath('css'))
        .pipe(this.getAssetsPath('js'))
        .pipe(this.getAssetsPath('img'))
        .pipe(this.getAssetsPath('media'))
        .pipe($.if(MANIFEST, this.getManifestPath()))
        .pipe(
          $.if(
            MANIFEST && BalmJS.config.assets.cache,
            BalmJS.file.setPublicPath()
          )
        );
    } else {
      stream = stream
        .pipe(this.getAssetsPath('css'))
        .pipe(this.getAssetsPath('js'));
    }

    stream
      .pipe(BalmJS.file.setPublicPath())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default HtmlTask;
