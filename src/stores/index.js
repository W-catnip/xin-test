import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { updateError } from '../http/api/items';

export const useQueryStore = defineStore('query', () => {
  // item有关请求参数
  const itemId = ref(null);
  const subject = ref(1);
  const type = ref('C1');
  const sort = ref('normal');
  const pagesize = ref(1);
  const pagenum = ref(1);
  const total = ref(200);
  // 合并subject与type以便获得存档
  const subjectDetails = computed(() => `item_${type.value.toLowerCase()}_s${subject.value}`
  )
  // 科目详情
  const subText = computed(() => {
    let res = null;
    switch (subjectDetails.value) {
      case 'item_a1_s1':
        res = 'A1科目一'
        break;
      case 'item_c1_s1':
        res = 'C1科目一'
        break;
      case 'item_a1_s4':
        res = 'A1科目四'
        break;
      case 'item_c1_s4':
        res = 'C1科目四'
        break;
      default:
        res = 'C1科目四'
        break;
    }
    return res;
  })
  // 存档对象
  const archive = ref(JSON.parse(window.localStorage.getItem(subjectDetails.value)) || {})
  // 改变存档对象
  function setArchive() {
    archive.value = JSON.parse(window.localStorage.getItem(subjectDetails.value)) || {}
  }
  // 题目数据
  const itemData = ref([]);
  // 考试数据
  const examData = ref(null);
  // 平均成绩
  const average = ref(0);
  const examArr = ref([]);
  const scoresArr = computed(() => {
    let res = examArr.value.reduce((arr, item) => {
      arr.push(item.score);
      return arr;
    }, [])
    return res;
  })
  watch(() => scoresArr.value,
    (value) => {
      if (value.length) {
        const sum = value.reduce((prev, curr) => prev += curr, 0);
        average.value = Math.round(sum / value.length);
      } else {
        average.value = 0;
      }
    })
  // Header标题
  const headerTitle = ref('');
  // 目前的题目id
  const currId = ref(1);
  // 登陆状态
  const logged = ref(false);
  // 用户信息
  const username = ref('点击登录');
  // 错题集数据
  const errorData = ref([]);
  // 加入错题集
  async function recordError(data) {
    const id = String(data.id);
    const obj = {};
    obj[id] = data.details;
    errorData.value.push(obj);
    JSON.stringify(data.details);
    await updateError(data);
  }
  // 更改Header标题
  function SetHeaderTtile(routerName) {
    switch (routerName) {
      case 'normal':
        headerTitle.value = '开始答题'
        break;
      case 'result':
        headerTitle.value = '答题结果'
        break;
      case 'exam':
        headerTitle.value = '模拟考试'
        break;
      case 'error':
        headerTitle.value = '收藏题集'
        break;
      case 'test':
        headerTitle.value = '随时小测'
        break;
      case 'testStat':
        headerTitle.value = '练习统计'
        break;
      case 'examStat':
        headerTitle.value = '考试记录'
        break;
      default:
        headerTitle.value = 'XIN驾考'
        break;
    }
  }
  return {
    itemId,
    subject,
    type,
    subjectDetails,
    sort,
    pagesize,
    pagenum,
    total,
    itemData,
    headerTitle,
    SetHeaderTtile,
    currId,
    logged,
    username,
    archive,
    examData,
    errorData,
    recordError,
    subText,
    setArchive,
    average,
    examArr,
    scoresArr
  }
})