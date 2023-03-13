import LoadComponent from './Load.vue';
import { createApp } from 'vue';

const app = createApp(LoadComponent);
const oFragment = document.createDocumentFragment();
const vm = app.mount(oFragment);

const load = {
  show() {
    vm.setVisible(true);
    document.body.appendChild(oFragment);
  },
  hide() {
    vm.setVisible(false);
  }
}

export default load;