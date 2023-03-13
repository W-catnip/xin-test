<!--
 * ItemsTemplate
 * @author: Catnip
 * @since: 2023-01-03
 * src\components\ItemsTemplate.vue
-->
<template>
  <div class="box" ref="itemCotent">
    <div class="container">
      <!-- 题目内容 -->
      <div class="content">
        <span class="type">
          {{ itemType }}
        </span>
        <span class="question">
          {{ itemIndex }}. {{ itemQuestion }}
        </span>
      </div>
      <div class="pic" v-if="itemPic"><img :src="itemPic"></div>
      <!-- 选项信息 -->
      <ul class="optionList">
        <!-- 绑定事件可以使用[]进行动态绑定与解绑 -->
        <li v-for="(option, index) of itemOptions" :key="index" @[eventName]="chooseOption(index, option)">
          <span class="letter" :class="{ 'right-ans': correct[index], 'false-ans': fault[index] }">
            {{ optionLetters[index] }}
          </span>
          <span class="optionCotent">
            {{ option }}
          </span>
          <div class="letter-right" v-if="correct[index] && chosenArray.includes(index) && confirmed">
            <svg-icon name="check" color="green" :width="px2vw(24)" :height="px2vw(24)"></svg-icon>
          </div>
        </li>
      </ul>
    </div>
    <!-- 多选题确定按钮 -->
    <button class="confirm-btn" v-if="multiAnswer && !confirmed" @click="multiConfirm">确定</button>
    <!-- 解析 -->
    <div class="border-box" v-if="explainShow">
      <ExplainVue :answer="itemAnswer" :explain="itemExplain"></ExplainVue>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, inject } from 'vue';
import { updateItemStat } from '../http/api/statistics';
import { useQueryStore } from '../stores';
import ExplainVue from './Explaination.vue';

// 判断是否是考试
const isExam = inject('isExam', false);
const itemData = ref({});
// 判断考试是否结束
const finished = inject('finished', false);
// 父组件传给子组件的数据是通过子组件的mounted阶段进行的处理，才能渲染到页面上，从而更新。但是数据发生变化的时候，mounted阶段已经过了，所以data捕获不到数据的更新，从而无法更新
const props = defineProps({
  // 题目详情
  data: {
    type: [Object, null],
    required: true,
  },
  // 用户选择
  chosen: {
    type: Array,
    default: null
  },
})
// 侦听传入的data,data改变时改变itemData,避免传入props时接口数据未返回使data为null的问题
watch(() => props.data
  , (value) => {
    itemData.value = value;
  })

// 用于记忆用户所选选项的数组
const chosenArray = ref([]);
onMounted(() => {
  itemData.value = props.data;
  // 如果用户做过该题执行:
  if (props.chosen && props.chosen.length) {
    eventName.value = null;
    chosenArray.value = props.chosen;
  }
})

// 判断题型
const itemType = computed(() => {
  let res = '';
  switch (itemData.value.option1) {
    case null:
      res = '判断题'
      break;
    default:
      if (itemAnswer.value && itemAnswer.value.length > 2) {
        res = '多选题'
      } else {
        res = '单选题'
      }
      break;
  }
  return res;
})

// 题目内容
const itemQuestion = computed(() => itemData.value.question);

// 题目选项
const itemOptions = computed(() => {
  if (!itemData.value.option1) {
    return ['对', '错']
  }
  let arr = [itemData.value.option1, itemData.value.option2, itemData.value.option3, itemData.value.option4]
  arr = arr.map(item => item.slice(2, item.length));
  return arr;
})

// 选项前缀
const optionLetters = computed(() => {
  let i = 0;
  const letters = [];
  while (itemOptions.value[i]) {
    // 可输出A-Z
    letters.push(String.fromCharCode(65 + i));
    i++;
  }
  return letters;
})

/* 选择逻辑 */
// 正确样式控制
const correct = ref([]);
const fault = ref([]);
const eventName = ref('click');

// 答案是否正确变量
const isRight = ref(false);

// 答案确定控制
const confirmed = ref(false);

// 控制解析
const explainShow = ref(false);

// 选择
const chooseOption = (index) => {
  // 选项变色
  let rightIndex = -1;
  if (!chosenArray.value.includes(index)) {
    chosenArray.value.push(index);
  }
  if (itemType.value !== '多选题') {
    if (itemOptions.value.length !== 4) {
      // 判断题
      rightIndex = itemOptions.value.findIndex(item => item == itemAnswer.value);
    } else {
      // 单选题
      rightIndex = optionLetters.value.findIndex(item => item == itemAnswer.value);
    }
    confirmed.value = true;
    correct.value[rightIndex] = true;
    if (index !== rightIndex) {
      fault.value[index] = true;
    } else {
      isRight.value = true;
    }
    resetTemplate();
  } else {
    // 多选题
    correct.value[index] = correct.value[index] ? false : true;
  }
}

// 多选确定
const multiConfirm = () => {
  confirmed.value = true;
  correct.value.fill(false);
  // 选项变色
  multiAnswer.value.forEach(item => {
    let rightIndex = optionLetters.value.findIndex(answer => item == answer);
    correct.value[rightIndex] = true;
  })
  chosenArray.value.forEach((item) => {
    if (!multiAnswer.value.includes(String.fromCharCode(65 + item))) {
      fault.value[item] = true;
    }
  })
  // 判断是否正确
  const stringArr = chosenArray.value.map(item => String.fromCharCode(65 + item));
  if (stringArr.toString() === multiAnswer.value.toString()) isRight.value = true;
  if (confirmed.value) {
    resetTemplate();
  }
}

/* 选择完毕后 */

// 将第一次选择情况传递给父组件
const emit = defineEmits(['setChosen'])
// 选择完成后的回调
const resetTemplate = async () => {
  // 显示答案
  if (!isExam || finished.value) {
    explainShow.value = true;
  }
  // 更新答题数据统计
  await updateItemStat({
    username: store.username,
    subjectDetails: store.subjectDetails,
    isRight: isRight.value
  })
  // 解绑事件
  eventName.value = null;
  emit('setChosen', {
    chosen: chosenArray.value,
    isRight: isRight.value,
    id: itemData.value.id
  });
  isRight.value = false;
}

// currId改变时，重置选择答案
const store = useQueryStore();
watch(() => store.currId,
  () => {
    explainShow.value = false;
    correct.value.fill(false);
    fault.value.fill(false);
    chosenArray.value.length = 0;
    eventName.value = 'click';
    confirmed.value = false;
  })

/* 选择逻辑结束 */

// 题目图片

const itemPic = computed(() => itemData.value.pic);
// 题目答案

const itemAnswer = computed(() => itemData.value.answer);

// 多选题答案
const multiAnswer = computed(() => {
  if (itemAnswer.value && itemAnswer.value.length > 2) return itemAnswer.value.split(',')
})

// 题目解析
const itemExplain = computed(() => itemData.value.explain);

// 题目序号
const itemIndex = computed(() => itemData.value.index || itemData.value.id);
</script>

<style lang='less' scoped>
.box {
  margin: 45px 0;

  .border-box {
    border-top: 5px solid #ddd;
  }

  button {
    background-color: #5cd998;
    margin: 0 87px 20px 87px;
  }
}


.content {

  .type {
    display: inline-block;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    width: 50px;
    height: 24px;
    line-height: 24px;
    background-color: #ddd;
    border-radius: 4px;
    margin-right: 20px;
  }

  .question {
    font-size: @main_fs;
    vertical-align: middle;
    line-height: 24px;
  }
}

.pic {
  width: 100%;
  min-height: 100px;
  max-height: 260px;
  text-align: center;
  margin-top: 10px;

  img {
    max-width: 100%;
    max-height: 260px;
    display: inline-block;
    object-fit: scale-down;
  }
}

.optionList {
  margin-top: 20px;

  li {
    position: relative;
    margin-bottom: 10px;
  }

  .letter {
    margin-right: 10px;
    display: inline-block;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 50%;
    border: 1px solid #bbb;
  }

  .letter-right {
    position: absolute;
    width: 24px;
    top: 0;
    background-color: #fff;
  }

  .optionCotent {
    font-size: @main_fs;
    line-height: 24px;
  }

  .right-ans {
    background-color: #5cd998;
  }

  .false-ans {
    background-color: #f74848;
  }

}
</style>
