import BalmTask from './balm';
import BalmStyleTask from './style';
import BalmImageTask from './image';

const TIME_FLAG = 'BalmJS Time';

// function run(tasks: any): void {
//   gulp.parallel(...tasks)();
// }

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.BalmStyleTask = BalmStyleTask;
BalmJS.BalmImageTask = BalmImageTask;
BalmJS.tasks = []; // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
// BalmJS.run = run;
