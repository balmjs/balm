import Vue from 'vue';
import App from '@/views/layouts/app';

import BalmUI from 'balm-ui'; // Mandatory
// import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'; // Optional
// import BalmUINext from 'balm-ui/dist/balm-ui-next'; // Experimental

import { isMP } from '@/config';
import KboneAPI from 'kbone-api';

export default function createApp() {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error);
  };
  window.addEventListener('error', evt =>
    console.log("window.addEventListener('error') =>", evt)
  );

  window.onload = function() {
    if (isMP) {
      const clientWidth = KboneAPI.getSystemInfoSync().screenWidth;
      const rootFontSize = `${clientWidth / 10}px`;
      document.documentElement.style.fontSize = rootFontSize;
    }
  };

  Vue.config.productionTip = false;
  Vue.use(BalmUI); // Mandatory
  // Vue.use(BalmUIPlus); // Optional
  // Vue.use(BalmUINext); // Experimental

  new Vue({
    el: '#app',
    render: h => h(App)
  });
}
