import cacheBalmCore from './utilities/cache-core';

global.BalmJS = {} as any;
BalmJS.loading = true;

cacheBalmCore();
