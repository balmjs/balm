import Vue from 'vue';
import App from '@/views/layouts/app';
import wxInit from '@/config/wx';
import logInit from '@/config/logger';

export default function createApp() {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  wxInit(Vue);
  logInit();

  Vue.config.productionTip = false;

  return new Vue({
    el: '#app',
    render: (h) => h(App)
  });
}
