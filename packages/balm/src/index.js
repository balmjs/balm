import balmBabelCore from '../../core/lib/index';
import balmTSCore from '../../core/tslib/index';

const useTslib = process.argv.includes('--balm-ts');
let balmCore = useTslib ? balmTSCore : balmBabelCore;

module.exports = balmCore;

export default balmCore;
