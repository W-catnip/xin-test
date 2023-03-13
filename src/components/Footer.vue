<!--
 * Footer
 * @author: Catnip
 * @since: 2023-01-04
 * src\components\Footer.vue
-->
<template>
  <div class="footer-box">
    <!-- 蒙版 -->
    <div class="mask" @click="setDialog()" v-if="dialogShow"></div>
    <div class="left-box" :class="{ exam: isExam }">
      <div><svg-icon name="cross" :width="px2vw(16)" fill="red"></svg-icon><span>{{ falseItemsNum }}</span></div>
      <div><svg-icon name="check" :width="px2vw(16)" fill="green"></svg-icon><span>{{ rightItemsNum }}</span></div>
      <div @click="setDialog()">
        <svg-icon name="more" :width="px2vw(16)"></svg-icon>
        <span>{{ currId }} / {{ total }}</span>
      </div>
    </div>
    <!-- 底部弹窗 -->
    <Transition name="dialog">
      <div class="dialog" v-if="dialogShow">
        <div class="head-box">
          <div class="left-box">
            <div><svg-icon name="cross" :width="px2vw(16)" fill="red"></svg-icon><span>{{ falseItemsNum }}</span></div>
            <div><svg-icon name="check" :width="px2vw(16)" fill="green"></svg-icon><span>{{ rightItemsNum }}</span>
            </div>
            <div @click="setDialog()">
              <svg-icon name="more" :width="px2vw(16)"></svg-icon>
              <span>{{ currId }} / {{ total }}</span>
            </div>
          </div>
        </div>
        <div style="height:30px"></div>
        <!-- 题目选择 -->
        <ul class="items">
          <li v-for="item of items" :key="item" @click="setItemId(item)"
            :class="{ 'right-item': archive[item] && archive[item].isRight, 'false-item': archive[item] && !archive[item].isRight }">
            {{ item
            }}</li>
        </ul>
      </div>

    </Transition>
    <div class="right-box" :class="{ exam: isExam }" @click="setMark">
      <div class="clock" v-if="isExam"><svg-icon name="clock" :width="px2vw(20)"></svg-icon><span>{{ minute
      }}:{{ second }}</span></div>
      <svg-icon :name="mark" :width="px2vw(20)">
      </svg-icon>
      <span>{{ markedText }}
      </span>
    </div>
  </div>
  <slot></slot>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, toRefs, reactive, inject, onMounted, watchEffect, nextTick } from 'vue';
import { useQueryStore } from '../stores';
import { deleteError } from '../http/api/items'
const store = useQueryStore();
const props = defineProps({
  archive: {
    type: Object,
    default: {}
  },
  positions: {
    type: Object,
    default: {}
  },
  isError: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: 0
  }
});
const reload = inject('reload', null);

const isExam = inject('isExam', false);
const rightItemsNum = computed(() => {
  if (!props.archive) return 0;
  let res = 0;
  for (let i in props.archive) {
    if (props.archive[i].isRight) {
      res++
    }
  }
  return res;
})
const falseItemsNum = computed(() => {
  if (!props.archive) return 0;
  let res = 0;
  for (let i in props.archive) {
    if (!props.archive[i].isRight) {
      res++
    }
  }
  return res;
})
// 收藏按钮逻辑控制
const markData = reactive({
  mark: 'unmarked',
  markedText: '未收藏',
})

const { mark, markedText } = toRefs(markData);
const currItem = computed(() => {
  return store.itemData[props.positions.curr];
})

// 按钮样式的控制参数
const marked = computed(() => {
  if (currItem.value !== undefined) {
    let res = false;
    const arr = store.errorData.map(item => {
      if (!item) return [];
      return Object.keys(item)[0];
    })
    res = arr.includes(String(currItem.value.id)) ? true : false;
    return res;
  }
})

// 监听是否被收藏，控制按钮样式
watchEffect(
  () => {
    if (marked.value) {
      markData.mark = 'marked'
      markData.markedText = '已收藏'
    } else {
      markData.mark = 'unmarked'
      markData.markedText = '未收藏'
    }
  })

// 收藏按钮逻辑
const setMark = async () => {
  if (marked.value) {
    const arr = store.errorData.map(item => {
      return Object.keys(item)[0]
    })
    const index = arr.findIndex(item => item == String(currItem.value.id))
    store.errorData.splice(index, 1);
    await deleteError({
      username: store.username,
      subjectDetails: store.subjectDetails,
      id: currItem.value.id
    });
    store.errorData.splice(index, 1);
    if (props.isError) reload();
    markData.mark = 'unmarked'
    markData.markedText = '未收藏'
  } else {
    const details = {};
    details[store.itemData[props.positions.curr].id] = { chosen: [], isRight: false };
    store.recordError({
      username: store.username,
      subjectDetails: store.subjectDetails,
      details: details[store.itemData[props.positions.curr].id],
      id: store.itemData[props.positions.curr].id
    })
    markData.mark = 'marked'
    markData.markedText = '已收藏'
  }
}

// 弹出框控制
const emit = defineEmits(['setScroll', 'setCurrItem', 'setSubmit', 'update:modelValue']);
const dialogShow = ref(false);
const setDialog = () => {
  dialogShow.value = dialogShow.value == false ? true : false;
  // 蒙版出现时禁止页面滚动
  emit('setScroll', dialogShow.value);
}

// 根据总数渲染题目选择框
const { total, currId } = storeToRefs(store);
const items = computed(() => {
  const res = [];
  for (let i = 1; i < store.total + 1; i++) {
    res.push(i);
  }
  return res;
})

// 倒计时逻辑
const timer = ref(null); //计时器
const minute = ref('0');
const second = ref('00');
const finished = inject('finished', false) //停止条件
const count = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
const countDown = () => {
  if (count.value <= 0) {
    emit('setSubmit');
    timer.value = null;
    return;
  }
  const { mm, ss } = durationFormatter(count.value);
  minute.value = mm;
  second.value = ss;
  if (finished.value) {
    timer.value = null;
    return;
  }
  timer.value = setTimeout(() => {
    count.value = count.value - 1;
    countDown();
  }, 1000);
}
const durationFormatter = (time) => {
  if (!time) return { ss: '00' };
  let t = time;
  let ss = t % 60;
  t = (t - ss) / 60;
  if (ss < 10) ss = '0' + ss;
  if (t < 1) return { ss };
  let mm = t % 60;
  if (mm < 10) mm = '0' + mm;
  return { mm, ss };
}
onMounted(() => {
  if (isExam) {
    countDown();
  }
})

//选择题目
const setItemId = (index) => {
  store.currId = index;
  const trueID = props.isError ? index + 1 : index;
  emit('setCurrItem', trueID);
  setDialog();
}

</script>

<style lang='less' scoped>
.footer-box {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  padding: 10px;
  width: 100%;
  border-top: 1px solid #ccc;
  .flex(@jc: space-between; );

  .left-box {
    .overview();
  }

  .left-box.exam {
    justify-content: flex-start;

    div {
      margin-right: 15px;
    }
  }

  .right-box {
    .flex();

    span {
      font-size: 15px;
      margin-left: 5px;
    }

    .clock {
      .flex();

      span {
        font-size: 14px;
      }
    }
  }

  .right-box.exam {
    .clock {
      margin-right: 15px;
    }
  }
}

.mask {
  position: fixed;
  top: 45px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  background-color: #888888ae;
}

.dialog {
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  width: 375px;
  height: 300px;
  background-color: #fff;
  overflow-y: scroll;

  .head-box {
    position: fixed;
    bottom: 262px;
    height: 38px;
    width: 360px;
    background-color: #fff;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
  }

  .left-box {
    margin: 6px;
  }


}



.dialog-enter-active,
.dialog-leave-active {
  transition: all .3s ease-in-out;
}

.dialog-enter-from,
.dialog-leave-to {
  transform: translateY(300px);
}

.items {
  padding-top: 5px;
  .flex(@jc: flex-start);
  flex-wrap: wrap;

  li {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 50%;
    margin: 0 10px 0;
    margin-bottom: 10px;
    font-size: @main_fs;
    text-align: center;
    line-height: 50px;
  }

  .right-item {
    color: #72ed54;
    border-color: #72ed54;
  }

  .false-item {
    color: #fc9a9a;
    border-color: #fc9a9a;
  }
}
</style>
