import utils from '../../packages/balm-core/src/utilities/utils';

describe('Balm Utils', function () {
  describe('#isString()', function () {
    it(
      'A String expected output: true',
      asyncCase(function () {
        const result = utils.isString('blubber');

        expect(result).to.equal(true);
      })
    );
  });

  describe('#isObject()', function () {
    it(
      'An Object expected output: true',
      asyncCase(function () {
        const result = utils.isObject({});

        expect(result).to.equal(true);
      })
    );
  });

  describe('#isArray()', function () {
    it(
      'An Array expected output: true',
      asyncCase(function () {
        const result = utils.isArray([]);

        expect(result).to.equal(true);
      })
    );
  });

  describe('#isFunction()', function () {
    it(
      'A Function expected output: true',
      asyncCase(function () {
        const result = utils.isFunction(function () {});

        expect(result).to.equal(true);
      })
    );

    it(
      'A GeneratorFunction expected output: true',
      asyncCase(function () {
        const result = utils.isFunction(function* () {});

        expect(result).to.equal(true);
      })
    );
  });

  describe('#deepMerge()', function () {
    it(
      'merge non-object',
      asyncCase(function () {
        const result = utils.deepMerge(0, 1);

        expect(result).to.equal(0);
      })
    );

    it(
      'merge object',
      asyncCase(function () {
        const result = utils.deepMerge(
          {
            balm: {}
          },
          {
            balm: {
              project: {
                name: 'BalmJS',
                since: 2016
              },
              author: 'N.Elf-mousE'
            }
          }
        );

        expect(JSON.stringify(result)).to.equal(
          '{"balm":{"project":{"name":"BalmJS","since":2016},"author":"N.Elf-mousE"}}'
        );
      })
    );
  });
});
