import { createApp } from 'vue';
import App from '@/views/layouts/app';
import BalmUI from 'balm-ui';
// import 'balm-ui/dist/balm-ui.css';

const app = createApp(App);

app.use(BalmUI);

app.mount('#app');
