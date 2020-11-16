import toNamespace from '../../packages/balm-core/src/utilities/namespace';

describe('Balm Namespace', function () {
  it(
    'namespace with string',
    asyncCase(function () {
      const result = toNamespace('foo');

      expect(result).to.equal('balm:foo');
    })
  );

  it(
    'namespace with array',
    asyncCase(function () {
      const result = toNamespace(['foo', 'bar']);

      expect(result[0]).to.equal('balm:foo');
      expect(result[1]).to.equal('balm:bar');
    })
  );
});
