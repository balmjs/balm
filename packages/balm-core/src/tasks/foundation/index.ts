import BalmTask from './balm';
import BalmStyleTask from './balm_style';

const TIME_FLAG = 'BalmJS Time';

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.BalmStyleTask = BalmStyleTask;
BalmJS.tasks = new Map(); // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
BalmJS.server = null;
BalmJS.watchFtpFile = '';
BalmJS.watching = false;
