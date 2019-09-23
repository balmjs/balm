import BalmTask from './balm';
import BalmStyleTask from './style';
import BalmImageTask from './image';

const TIME_FLAG = 'BalmJS Time';

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.BalmStyleTask = BalmStyleTask;
BalmJS.BalmImageTask = BalmImageTask;
BalmJS.tasks = []; // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
BalmJS.input = '';
BalmJS.output = '';
