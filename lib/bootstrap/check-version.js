import request from 'request';
import semver from 'semver';
import chalk from 'chalk';
import packageConfig from '../../package.json';

const checkVersion = done => {
  request(
    {
      url: 'https://registry.npmjs.org/balm',
      timeout: 1000
    },
    (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let latestVersion = JSON.parse(body)['dist-tags'].latest;
        let localVersion = packageConfig.version;
        if (semver.lt(localVersion, latestVersion)) {
          console.log(chalk.yellow('  A newer version of balm is available.'));
          console.log();
          console.log('  latest:    ' + chalk.green(latestVersion));
          console.log('  installed: ' + chalk.red(localVersion));
          console.log();
        }
      }
      done();
    }
  );
};

export default checkVersion;
