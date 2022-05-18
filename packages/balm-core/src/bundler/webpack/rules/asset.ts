import { imgRegex, fontRegex, mediaRegex } from '../config/regex.js';
import { ASSET } from '../../../config/constants.js';
import { RuleSetRule } from '@balm-core/index';

function assetLoader(): RuleSetRule[] {
  return [
    // "url" loader works like "file" loader except that it embeds assets
    // smaller than specified limit in bytes as data URLs to avoid requests.
    // A missing `test` is equivalent to a match.
    {
      test: imgRegex,
      type: BalmJS.config.scripts.imageAssetType,
      parser: {
        dataUrlCondition: {
          maxSize: BalmJS.config.scripts.imageInlineSizeLimit
        }
      },
      generator: {
        filename: BalmJS.file.assetsPath(
          `${ASSET.dir}/${BalmJS.config.paths.target.img}/[name].${ASSET.hash}[ext]`
        )
      }
    },
    {
      test: fontRegex,
      type: 'asset/resource',
      generator: {
        filename: BalmJS.file.assetsPath(
          `${ASSET.dir}/${BalmJS.config.paths.target.font}/[name].${ASSET.hash}[ext]`
        )
      }
    },
    {
      test: mediaRegex,
      type: 'asset/resource',
      generator: {
        filename: BalmJS.file.assetsPath(
          `${ASSET.dir}/${BalmJS.config.paths.target.media}/[name].${ASSET.hash}[ext]`
        )
      }
    }
  ];
}

export default assetLoader;
