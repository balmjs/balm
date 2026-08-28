import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BALM_ROOT = path.resolve(__dirname, '..');

process.env.BALM_ROOT = BALM_ROOT;
process.env.BALM_CORE = path.join(BALM_ROOT, 'packages', 'balm-core');
