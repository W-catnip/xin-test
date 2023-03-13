<!--
 * ScrollTab
 * @author: Catnip
 * @since: 2023-01-05
 * src\components\scroll\ScrollTab.vue
-->
<template>
  <div class="tab-box" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  id: Number,
  transArr: Array
})
// 滑动逻辑

// 滑动所需变量
const startX = ref(0),
  startY = ref(0),
  endX = ref(0),
  endY = ref(0),
  dValueX = ref(0),
  dValueY = ref(0),
  translateX = ref(0),
  horizontalMoved = ref(false),
  verticalMoved = ref(false),
  screenWidth = window.screen.width;

const onTouchStart = (e) => {
  // e.targetTouches：一个数组，记录了手指触摸的信息
  startX.value = e.targetTouches[0].pageX;
  startY.value = e.targetTouches[0].pageY;
}

// 触摸移动时
const onTouchMove = (e) => {
  endX.value = e.targetTouches[0].pageX;
  endY.value = e.targetTouches[0].pageY;
  dValueX.value = Math.abs(startX.value - endX.value);
  dValueY.value = Math.abs(startY.value - endY.value);

  const stopRange = window.screen.width - window.screen.width / 3;
  // 水平滑动长度大于纵向滑动长度，选择水平滑动
  if (dValueX.value > dValueY.value) {
    if (verticalMoved.value) {
      return;
    } else horizontalMoved.value = true;

    if (dValueX.value < stopRange) {
      // 左滑
      if (startX.value > endX.value) {
        translateX.value = dValueX.value * -1;
      } else {
        // 右滑
        translateX.value = dValueX.value;
      }
      handleDrag({ value: translateX.value, id: props.id });
    }
    if (e.cancelable) e.preventDefault();
  } else {
    if (horizontalMoved.value && e.cancelable) e.preventDefault();
    else verticalMoved.value = true;
  }
}

const onTouchEnd = (e) => {
  const range = window.screen.width / 2;
  if (horizontalMoved.value) {
    // 拖拽位移复原
    switch (props.id) {
      case 0:
        handleInit([0, screenWidth, -screenWidth])
        break;
      case 1:
        handleInit([-screenWidth, 0, screenWidth]);
        break;
      case 2:
        handleInit([screenWidth, -screenWidth, 0])
        break;
      default:
        break;
    }
    // 滑动超过屏幕一半触发handleChange
    if (dValueX.value > range) {
      // 左滑处理
      if (startX.value > endX.value) {
        handleChange({
          direction: 'left',
          id: props.id
        });
      }
      // 右滑处理
      else {
        handleChange({
          direction: 'right',
          id: props.id
        });
      }
    }
  }
  // 重新初始化
  horizontalMoved.value = false;
  verticalMoved.value = false;
  translateX.value = 0;
  startX.value = endX.value = 0;
  startY.value = endY.value = 0;
}
// 暴露事件给父组件
const emit = defineEmits(['change', 'drag', 'init']);
const handleChange = (obj) => emit('change', obj);
const handleDrag = (value) => emit('drag', value);
const handleInit = (arr) => emit('init', arr);
</script>

<style lang='less' scoped>
.tab-box {
  width: 375px;
  min-height: 600px;
}
</style>
