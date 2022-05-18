import wxApi from 'kbone-api';
import { isMP } from '@/config';

const PhoneBreakpoint = 375;

function responsive() {
  const root = document.documentElement;
  const screenWidth = isMP
    ? wxApi.getSystemInfoSync().screenWidth
    : window.innerWidth;

  if (screenWidth < 450) {
    const scale = isMP
      ? screenWidth / PhoneBreakpoint
      : window.screen.width / PhoneBreakpoint;
    const rootFontSize = `${(PhoneBreakpoint / 10) * scale}px`;
    root.style.fontSize = rootFontSize;
  } else {
    root.removeAttribute('style');
  }
}

function autoUpdateVersion() {
  if (wxApi.canIUse('getUpdateManager')) {
    const updateManager = wxApi.getUpdateManager();

    updateManager.onCheckForUpdate(({ hasUpdate }) => {
      if (hasUpdate) {
        updateManager.onUpdateReady(() => {
          wxApi.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success({ confirm }) {
              if (confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });

        updateManager.onUpdateFailed(() => {
          wxApi.showModal({
            title: '更新提示',
            content: '新版本已经准备好，请您删除当前小程序，重新搜索打开哟~'
          });
        });
      }
    });
  } else {
    wxApi.showModal({
      title: '提示',
      content:
        '当前微信版本过低，无法自动更新小程序，请升级到最新微信版本后重试。'
    });
  }
}

export default {
  install(app) {
    if (isMP) {
      window.addEventListener('wxload', autoUpdateVersion);

      window.onload = responsive;
      window.addEventListener('wxshow', responsive);
      wxApi.onWindowResize(() => wxApi.nextTick(() => responsive()));

      app.prototype.$wxApi = wxApi;
    }
  }
};
export { responsive };
