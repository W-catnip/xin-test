<!--
 * PopUp
 * @author: Catnip
 * @since: 2023-02-10
 * src\components\popup\PopUp.vue
-->
<template>
  <transition name="message-fade">
    <div :class="[
      'message',
      'message-' + type
    ]" :style="{ top: px2vw(state.offset) }" v-if="!state.closed">
      <p class="message-content" z>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { px2vw } from '../../utils';

const state = reactive({
  offset: 20,
  closed: false,
  duration: 1000,
  timer: null
})
const props = defineProps({
  message: {
    type: String,
    default: '默认信息'
  },
  type: {
    type: String,
    default: 'success'
  },
  //扩充一个功能 弹框消失后触发
  onClose: {
    type: Function,
    default: null
  },
})
const close = () => {
  state.closed = true;
  if (typeof props.onClose == 'function') {
    props.onClose();
  }
}
onMounted(() => {
  state.timer = setTimeout(() => {
    if (!state.closed) {
      close();
    }
  }, state.duration)
})
</script>

<style lang='less' scoped>
.message {
  min-width: 320px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #EBEEF5;
  position: fixed;
  left: 50%;
  top: 20px;
  z-index: 999999999;
  transform: translateX(-50%);
  background-color: #fcfcfc;
  transition: opacity .3s, transform .4s, top .4s;
  overflow: hidden;
  padding: 15px 15px 15px 20px;
  .flex;
  justify-content: center;
}

.message p {
  margin: 0
}

.message-info .message-content {
  color: #909399
}

.message-success .message-content {
  color: #67C23A
}

.message-warning .message-content {
  color: #E6A23C
}

.message-error .message-content {
  color: #F56C6C
}

.message-content {
  padding: 0;
  font-size: 14px;
  line-height: 1
}

.message-content:focus {
  outline-width: 0
}

.message-fade-enter,
.message-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%)
}
</style>
