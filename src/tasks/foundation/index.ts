import BalmTask from './balm';
import BalmStyleTask from './style';
import BalmImageTask from './image';

const TIME_FLAG = 'BalmJS Time';

// function done(cb: Function): void {
//   cb();
// }

// function run(tasks: string[]): void {
//   gulp.parallel(...tasks, done)();
// }

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.BalmStyleTask = BalmStyleTask;
BalmJS.BalmImageTask = BalmImageTask;
BalmJS.tasks = []; // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
// BalmJS.run = run;
