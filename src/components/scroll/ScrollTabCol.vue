<!--
 * ScrollTabCol
 * @author: Catnip
 * @since: 2023-01-05
 * src\components\scroll\ScrollTabCol.vue
-->
<template><!-- 遮挡盒子 -->
  <div class="out-box">
    <div class="temp-box">
      <ScrollTab class="scroll-tab" :transArr="translateX" :id="index"
        :style="`transition-duration: ${dur[index]}ms;left: ${leftX[index]}px;transform:translateX(${translateX[index]}px)`"
        @change="moveHandle" @drag="dragHandle" @init="initHandle" v-for="(item, index) of itemData" :key="index">
        <ItemTemplate :data="item" @setChosen="setChosen">
        </ItemTemplate>
      </ScrollTab>
    </div>
</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, reactive } from 'vue';
import { useQueryStore } from '../../stores';
import ItemTemplate from '../ItemTemplate.vue';
import ScrollTab from './ScrollTab.vue';

const store = useQueryStore();
const screenWidth = ref(window.screen.width);
const { itemData } = storeToRefs(store);
const translateX = ref([0, screenWidth.value, -screenWidth.value]);
const leftX = ref([0, -screenWidth.value, -screenWidth.value * 2]);
const dur = ref([0, 0, 0])
const emit = defineEmits(['afterMove', 'setChosen'])
// 滑动改变itemId 用于获取指定id的题目数据
const positions = reactive({
  curr: 0,
  prev: 2,
  next: 1
})
// 获取三条数据以便滑动
const props = defineProps({
  setItems: {
    type: Object
  },
})
const setId = (Ids) => {
  const { curr, prev, next } = Ids;
  positions.curr = curr;
  positions.next = next;
  positions.prev = prev;
  // 更改当前显示的id
  store.currId = store.itemData[curr].index;
}
// 侦听currId
watch(() => store.currId,
  () => {
    if (store.currId == 1) {
      props.setItems.setPrev(store, 2);
    } else {
      props.setItems.setPrev(store);
    }
    if (store.currId == store.total) {
      props.setItems.setNext(store, 1);
    } else {
      props.setItems.setNext(store);
    }
  })

onMounted(async () => {
  store.itemId = 1;
  store.currId = 1;
  emit('afterMove', positions);
  await props.setItems.setCurr(store);
  await props.setItems.setNext(store);
  if (store.currId == 1) {
    await props.setItems.setPrev(store, 2);
  }
})


//位置复原事件
const initHandle = (arr) => {
  translateX.value = arr;
}

// 各题目实际位置
let prev = 2, curr = 0, next = 1;
// 位置参数改变
const changePositions = (id) => {
  switch (id) {
    case 1:
      prev = 0, curr = 1, next = 2;
      break;
    case 2:
      prev = 1, curr = 2, next = 0;
      break;
    default:
      prev = 2, curr = 0, next = 1;
      break;
  }
}
// 拖拽逻辑
const dragHandle = (obj) => {
  // 边界条件
  if (store.currId == 1 && obj.value > 0) {
    return;
  }
  if (store.currId == store.total && obj.value < 0) {
    return;
  }
  changePositions(obj.id)
  dur.value = [0, 0, 0]
  translateX.value[prev] = -screenWidth.value + obj.value;
  translateX.value[curr] = obj.value;
  translateX.value[next] = screenWidth.value + obj.value;
}
// 数组元素移动
const moveArray = (arr, dire) => {
  if (dire == 'left') {
    let temp = arr[arr.length - 1];
    for (let i = arr.length - 1; i > 0; i--) {
      arr[i] = arr[i - 1];
    }
    arr[0] = temp;
  }
  if (dire == 'right') {
    let temp = arr[0];
    for (let i = 0; i < arr.length - 1; i++) {
      arr[i] = arr[i + 1];
    }
    arr[arr.length - 1] = temp;
  }
}
// 滑动逻辑
const moveHandle = (obj) => {
  emit('afterMove', positions);
  // 边界条件
  if (store.currId == 1 && obj.direction == 'right') {
    return;
  }
  if (store.currId == store.total && obj.direction == 'left') {
    return;
  }
  // 过渡效果添加
  if (obj.direction == 'left') {
    changePositions(next);
    dur.value[prev] = 300;
  } else if (obj.direction == 'right') {
    changePositions(prev);
    dur.value[next] = 300;
  }
  dur.value[curr] = 300;
  // 移动数组
  moveArray(translateX.value, obj.direction);
  // 传递当前data的位置信息
  setId({ curr, prev, next })
}
const setChosen = (value) => {
  emit('setChosen', value);
}
</script>

<style lang='less' scoped>
.out-box {
  overflow: hidden
}

.temp-box {
  position: relative;
  width: 1125px;
  .flex(@jc: flex-start; @ai: flex-start; );

  div {
    flex-shrink: 0;
  }

  .scroll-tab {
    position: relative;
  }
}
</style>
