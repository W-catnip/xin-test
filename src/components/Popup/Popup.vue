<!--
 * Popup
 * @author: Catnip
 * @since: 2023-02-23
 * src\components\Popup\Popup.vue
-->
<template>
  <transition name="tran-messageBox">
    <div class="messageBox" v-if="state.visible" @click="cancel">
      <div class="contentBox" @click.stop>
        <div class="messageTitle">
          <h1>{{ title }}</h1>
        </div>
        <div class="messageCotent">
          <p>{{ content }}</p>
        </div>
        <div class="messageBtnGroup">
          <div class="btn" @click="cancel">{{ cancelBtnText }}</div>
          <div class="btn" @click="confirm">{{ confirmBtnText }}</div>
        </div>
      </div>
    </div>
</transition>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '默认标题'
  },
  content: {
    type: String,
    default: '默认内容'
  },
  showCancelBox: {
    type: Boolean,
    default: false
  },
  confirmBtnText: {
    type: String,
    default: '确定'
  },
  cancelBtnText: {
    type: String,
    default: '取消'
  },
})
const state = reactive({
  visible: false,
  type: 'confirm'
})

// 设置可见性
const setVisible = (isVisible) => {
  state.visible = isVisible;
}
// 取消
const cancel = () => {
  state.type = 'cancel';
  setVisible(false);
}
// 确定
const confirm = () => {
  state.type = 'confirm';
  setVisible(false);
}
defineExpose({
  setVisible,
  state
})
</script>

<style lang='less' scoped>
.messageBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(204, 204, 204, 0.537);
  text-align: center;

  .contentBox {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: 300px;
    height: 150px;
    background-color: #fff;
    border-radius: 10px;
  }

}


.messageTitle {
  margin: 20px 0 10px 0;

  h1 {
    font-size: 20px;
  }
}

.messageCotent {
  margin-bottom: 20px;

  p {
    font-size: 16px;
    color: #888;
  }
}

.messageBtnGroup {
  border-top: 1px solid #eee;
  padding: 10px;
  .flex();

  .btn {
    flex-grow: 1;
    font-size: 16px;
  }
}

.tran-messageBox-enter-from,
.tran-messageBox-leave-to {
  opacity: 0;
}

.tran-messageBox-enter-active {
  transition: opacity .3s ease-in;
  ;
}

.tran-messageBox-leave-active {
  transition: opacity .3s ease-out;
}
</style>
