import Vue from 'vue';
import App from '@/views/layouts/app';
import BalmUI from 'balm-ui'; // Mandatory
// import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'; // Optional
// import BalmUINext from 'balm-ui/dist/balm-ui-next'; // Experimental

Vue.config.productionTip = false;
Vue.use(BalmUI); // Mandatory
// Vue.use(BalmUIPlus); // Optional
// Vue.use(BalmUINext); // Experimental

new Vue({
  el: '#app',
  components: { App },
  template: '<app/>'
});
