import { STATIC_ASSETS } from '../../../config/constants';
import { imgRegex, fontRegex, mediaRegex } from '../config/regex';
import { RuleSetRule } from '@balm-core/index';

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

function urlLoader(): RuleSetRule[] {
  const PATHNAME = `${BalmJS.config.paths.target.js}/${STATIC_ASSETS}/`;
  const FILENAME = '[name].[hash:8].[ext]';
  const options = Object.assign(
    {
      limit: imageInlineSizeLimit, // Loads files as `base64` encoded URL
      name: BalmJS.file.assetsPath(`${PATHNAME}${FILENAME}`),
      esModule: BalmJS.config.scripts.useEsModule
    },
    BalmJS.config.scripts.urlLoaderOptions
  );

  return [
    // "url" loader works like "file" loader except that it embeds assets
    // smaller than specified limit in bytes as data URLs to avoid requests.
    // A missing `test` is equivalent to a match.
    {
      test: imgRegex,
      loader: require.resolve('url-loader'),
      options
    },
    {
      test: mediaRegex,
      loader: require.resolve('url-loader'),
      options
    },
    {
      test: fontRegex,
      loader: require.resolve('url-loader'),
      options
    }
  ];
}

export default urlLoader;
