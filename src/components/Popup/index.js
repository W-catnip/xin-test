import PopupComponent from './Popup.vue'
import { createApp, watch } from 'vue';

export const popup = (options) => {
  const popupApp = createApp(PopupComponent, options);
  return new Promise((resolve, reject) => {
    showPopup(popupApp, { resolve, reject })
  })
}

const showPopup = (app, { resolve, reject }) => {
  const oFragment = document.createDocumentFragment();
  const vm = app.mount(oFragment);
  document.body.appendChild(oFragment);
  vm.setVisible(true);
  watch(vm.state, (state) => {
    // 判断弹窗是否消失
    if (!state.visible) {
      switch (state.type) {
        case 'cancel':
          reject();
          break;
        case 'confirm':
          resolve();
          break;
        default:
          break;
      }
      hidePopup(app);
    }
  })
}
const hidePopup = (app) => {
  app.unmount();
}