import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { LooseObject } from '@balm-core/index';

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

const dotenvFile = BalmJS.file.resolveApp('.env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenvFile}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotenvFile}.local`,
  `${dotenvFile}.${NODE_ENV}`,
  dotenvFile
].filter(Boolean) as string[];

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
  if (node.fs.existsSync(dotenvFile)) {
    dotenvExpand.expand(
      dotenv.config({
        path: dotenvFile
      })
    );
  }
});

// Grab NODE_ENV and BALM_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const BALM_APP = /^BALM_APP_/i;

function getClientEnvironment(publicUrl: string) {
  const raw = Object.keys(process.env)
    .filter((key) => BALM_APP.test(key))
    .reduce(
      (env, key) => {
        (env as LooseObject)[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches webapp into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
        // For custom DefinePlugin
        ...BalmJS.config.scripts.nodeEnv
      }
    ) as LooseObject;

  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      (env as LooseObject)[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  BalmJS.logger.debug('webpack .env', stringified, {
    pre: true
  });

  return { raw, stringified };
}

export default getClientEnvironment;
