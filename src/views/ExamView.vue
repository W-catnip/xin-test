<!--
 * TestView
 * @author: Catnip
 * @since: 2023-02-21
 * src\views\TestView.vue
-->
<template>
  <HeaderVue>{{ headerTitle }}</HeaderVue>
  <ScrollTabCol :setItems="setItems" @afterMove="setPositions" @setChosen="setChosen"></ScrollTabCol>
  <!-- 底部 -->
  <FooterVue :positions="positions" :archive="examArchive" @setScroll="setScroll" @setCurrItem='setCurrItem'
    @setSubmit="submit" v-model="duration"></FooterVue>
  <button class="submit" @click="submit">{{ btnText }}</button>
</template>

<script setup>
import HeaderVue from '../components/Header.vue';
import ScrollTabCol from '../components/scroll/ScrollTabCol.vue';
import FooterVue from '../components/Footer.vue';
import { getExam } from '../http/api/items';
import { useQueryStore } from '../stores';
import { storeToRefs } from 'pinia';
import { ref, onUnmounted, provide, inject, computed } from 'vue';
import { popup } from '../components/Popup'
import { addExamStat } from '../http/api/statistics';

// 提供isExam
provide('isExam', true);
const finished = ref(false);
provide('finished', finished);
const store = useQueryStore();
const { headerTitle } = storeToRefs(store);

// 题目模板位置设置
let positions = ref({});
const setPositions = (value) => {
  positions.value = value;
}

onUnmounted(() => {
  store.examData = null;
})
// 重设Data的序号
const resetID = (data) => {
  for (let key in data) {
    data[key].index = Number(key) + 1;
  }
}
// 获得要渲染的数据
const setCurr = async (store, id = store.currId - 1) => {
  if (!store.examData) {
    await getExam(store);
    resetID(store.examData);
    store.total = store.examData.length;
  }
  const curr = store.examData[id];
  store.itemData[positions.value.curr] = curr;
}
const setPrev = (store, id = store.currId - 2) => {
  const prev = store.examData[id];
  store.itemData[positions.value.prev] = prev;
}
const setNext = (store, id = store.currId) => {
  const next = store.examData[id];
  store.itemData[positions.value.next] = next;
}
const setItems = {
  setPrev,
  setCurr,
  setNext
}

const setCurrItem = async (id) => {
  await setCurr(store, id - 1);
}

// 答题组件的选择回调
const examArchive = ref({});
const setChosen = (obj) => {
  const chosen = JSON.parse(JSON.stringify(obj.chosen))
  examArchive.value[store.currId] = {
    chosen,
    isRight: obj.isRight
  }
  if (!obj.isRight) {
    store.recordError({
      username: store.username,
      subjectDetails: store.subjectDetails,
      details: examArchive.value[store.currId],
      id: store.itemData[positions.value.curr].id
    });
  }
}

// 评卷
const score = ref(0);
const setScore = (obj) => {
  const sub = store.subject;
  const magnification = sub == 4 ? 2 : 1;
  for (let key in obj) {
    if (obj[key].isRight) {
      score.value += magnification;
    }
  }
}

// 按钮信息
const btnText = ref('提交');
// 提交试卷
const reload = inject('reload');
// 考试时间
const duration = ref(2700);
const record = (duration) => {
  // 记录考试时间
  let date = new Date().toLocaleString('chinese', { hour12: false });
  date = date.substring(0, 14);
  // 计算考试用时
  let value = 2700 - duration;
  let cost = 0;
  if (value > 60) {
    const s = value % 60;
    const m = (value - s) / 60;
    cost = m + '分' + s + '秒'
  } else {
    cost = value + '秒'
  }
  return {
    date,
    cost
  }
}
const submit = () => {
  if (btnText.value == '提交') {
    popup({
      title: '提交试卷',
      content: '您确定提交试卷吗？'
    }).then(async () => {
      const { date, cost } = record(duration.value);
      // 触发评卷函数
      setScore(examArchive.value);
      // 拼接考试记录数据
      const examData = {
        date,
        cost,
        score: score.value
      }
      await addExamStat({
        subjectDetails: store.subjectDetails,
        examData,
        username: store.username
      })
      finished.value = true;
      popup({
        title: '考试得分',
        content: `此次考试您得到了${score.value}分，继续加油哦！`,
        confirmBtnText: '重新出卷',
        cancelBtnText: '继续作答'
      }).then(() => {
        reload()
      }).catch(() => {
        btnText.value = '重新出卷'
      })
    }).catch(() => {
    });
  } else {
    reload();
    btnText.value = '提交'
  }
}

// 通过添加position:fixed禁止滚动；
// 控制页面滚动
const scroll = ref(false);
const setScroll = (value) => {
  scroll.value = value;
}
</script>

<style lang='less' scoped>
.submit {
  position: fixed;
  right: 20px;
  bottom: 60px;
  color: #fff;
  border: none;
  box-shadow: #999 1px 1px 8px;
  background-color: rgb(104, 191, 123);
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
