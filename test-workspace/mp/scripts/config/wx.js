import KboneAPI from 'kbone-api';
import { isMP } from '@/config';

function refreshRem() {
  let clientWidth = KboneAPI.getSystemInfoSync().screenWidth;
  if (clientWidth > 540) {
    clientWidth = 540;
  }
  const rootFontSize = `${clientWidth / 10}px`;
  document.documentElement.style.fontSize = rootFontSize;
}

function wxInit(Vue) {
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
  Vue.use(KboneAPI);
}

export default wxInit;
