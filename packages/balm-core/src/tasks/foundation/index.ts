import BalmTask from './balm.js';
import BalmStyleTask from './balm_style.js';

BalmJS.BalmTask = BalmTask;
BalmJS.BalmStyleTask = BalmStyleTask;
BalmJS.tasks = new Map(); // Main tasks
BalmJS.recipes = []; // Sub tasks
BalmJS.recipeIndex = 0;
BalmJS.server = null;
BalmJS.watchFtpFile = '';
BalmJS.watching = false;
