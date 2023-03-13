import MessageComponent from './Message.vue';
import { createApp } from 'vue';

//装有instance消息弹框组件对象的容器
let instances = [];

const Message = (options) => {
  // 处理参数
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  // 每消失一个消息弹框就会触发一个onClose
  options.onClose = function () {
    Message.close(vm);
  }
  // 第二个参数为传入实例中的props
  const app = createApp(MessageComponent, options);
  // 挂载实例
  const oFragment = document.createDocumentFragment();
  const vm = app.mount(oFragment);
  document.body.appendChild(oFragment);
  instances.push(vm);
}

// 关闭弹窗
Message.close = function (instance) {
  instances = instances.filter(item => item !== instance);
}

const dataArr = ['success', 'error', 'warning', 'info']
dataArr.forEach(type => {
  Message[type] = function (options) {
    if (typeof options == 'string') {
      options = {
        message: options
      }
      options.type = type;
      return Message(options);
    }
  }
})

export default Message;