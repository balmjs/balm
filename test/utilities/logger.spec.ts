import color from '../../packages/balm-core/src/utilities/color';
import logger from '../../packages/balm-core/src/utilities/logger';

describe('Balm Logger', function () {
  describe('#color()', function () {
    it(
      'default style',
      asyncCase(function () {
        const result = color(`<label>`);

        expect(result).to.equal('\u001b[37m<label>\u001b[39m');
      })
    );

    it(
      'style with colorStyle',
      asyncCase(function () {
        const result = color(`<label>`, {
          modifier: 'bold',
          color: 'blue',
          background: true,
          bright: true,
          symbol: 'check'
        });
        const symbol = isWin ? '√' : '✔';

        expect(result).to.equal(
          `\u001b[1m\u001b[104m${symbol} <label>\u001b[49m\u001b[22m`
        );
      })
    );
  });

  describe('#success/debug/info/warn/error()', function () {
    it(
      'success',
      asyncCase(function () {
        logger.success('success', 'Hello');
        logger.success('success', 'BalmJS', {
          logLevel: 3
        });
      })
    );

    it(
      'debug',
      asyncCase(function () {
        logger.debug('debug', 'Hello');
        logger.debug('debug', 'BalmJS', {
          logLevel: 3
        });
      })
    );

    it(
      'info',
      asyncCase(function () {
        logger.info('info', 'Hello');
        logger.info('info', 'BalmJS', {
          logLevel: 3
        });
      })
    );

    it(
      'warn',
      asyncCase(function () {
        logger.warn('warn', 'Hello');
        logger.warn('warn', 'BalmJS', {
          logLevel: 0
        });
      })
    );

    it(
      'error',
      asyncCase(function () {
        logger.error('error', 'Hello');
        logger.error('error', 'BalmJS', {
          logLevel: 0
        });
      })
    );
  });
});
