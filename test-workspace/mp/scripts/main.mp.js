import Vue from 'vue';
import $wxApi from '@/plugins/wx-api';
import App from '@/views/layouts/app';
import logInit from '@/config/logger';
import { isMP } from '@/config';

export default function createApp() {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  logInit();

  Vue.config.productionTip = false;
  Vue.prototype.isMP = isMP;
  Vue.use($wxApi);

  return new Vue({
    el: '#app',
    render: (h) => h(App)
  });
}
