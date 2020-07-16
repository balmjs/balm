import Vue from 'vue';
import App from '@/views/layouts/app';
import { isMP } from '@/config';

import KboneAPI from 'kbone-api';

function refreshRem() {
  let clientWidth = KboneAPI.getSystemInfoSync().screenWidth;
  if (clientWidth > 540) {
    clientWidth = 540;
  }
  const rootFontSize = `${clientWidth / 10}px`;
  document.documentElement.style.fontSize = rootFontSize;
}

export default function createApp() {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error);
  };
  window.addEventListener('error', (evt) =>
    console.log("window.addEventListener('error') =>", evt)
  );

  if (isMP) {
    window.onload = refreshRem;

    window.addEventListener('wxshow', refreshRem);

    KboneAPI.onWindowResize(() => {
      KboneAPI.nextTick(() => {
        refreshRem();
      });
    });
  }

  Vue.prototype.isMP = isMP;

  Vue.config.productionTip = false;

  Vue.use(KboneAPI);

  new Vue({
    el: '#app',
    render: (h) => h(App)
  });
}
