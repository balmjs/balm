import Vue from 'vue';
import App from '@/views/layouts/app';
import BalmUI from 'balm-ui';
// import 'balm-ui/dist/balm-ui.css';
import '@styles/tailwind.css';

Vue.config.productionTip = false;

Vue.use(BalmUI);

new Vue({
  el: '#app',
  components: { App },
  template: '<app/>'
});
