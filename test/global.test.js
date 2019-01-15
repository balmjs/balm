import assert from 'assert';
import { version } from '../package.json';

describe('Test balm global variables', () => {
  describe('#global', () => {
    it('BalmJS.version should return current version in package.json', async () => {
      assert.equal(BalmJS.version, version);
    });
  });
});
