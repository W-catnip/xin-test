import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入全局less样式
import '@/styles/index.less';
// 导入内联px转vw方法
import { px2vw } from './utils';
// 导入svg组件
import svgIcon from '@/components/SvgIcon.vue'
// 引入全局弹窗生成函数
import Message from './components/Message'

const app = createApp(App);
// 将方法挂载到全局
app.config.globalProperties.px2vw = px2vw;
app.config.globalProperties.Message = Message;

app.use(createPinia())
app.use(router)
app.component('svg-icon', svgIcon)

app.mount('#app')
