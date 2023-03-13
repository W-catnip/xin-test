<!--
 * TestStat
 * @author: Catnip
 * @since: 2023-03-06
 * src\views\TestStat.vue
-->
<template>
  <Header>{{ headerTitle }}</Header>
  <div class="pie">
    <div ref="pieDom" style="width: 100%; height: 380px"></div>
    <ul>
      <h2>在{{ store.subText }}练习与考试中：</h2>
      <li>
        <span class="normal-font">
          您共答对<span class="right-font">{{ rightData.right }}</span>次
        </span>
        <span class="normal-font">
          正确率<span class="right-font">{{ rightRate }}</span>%
        </span>
      </li>
      <li>
        <span class="normal-font">
          您共答错<span class="false-font">{{ rightData.false }}</span>次
        </span>
        <span class="normal-font">
          错误率<span class="false-font">{{ falseRate }}</span>%
        </span>
      </li>
      <button @click="clearTestStat" class="confirm-btn clear-btn">清除练习统计数据</button>
    </ul>
</div>
</template>

<script setup>
import { onBeforeMount, ref, onMounted, computed, watch, reactive, inject } from 'vue';
import { getItemStat, clearItemStat } from '../http/api/statistics';
import { useQueryStore } from '../stores';
import Header from '../components/Header.vue';
import { storeToRefs } from 'pinia';
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { popup } from '../components/Popup';

const store = useQueryStore();
const { headerTitle } = storeToRefs(store);
const finishedTotal = computed(() => {
  return Object.keys(store.archive).length;
})
const reload = inject('reload');
// 数据获取
onBeforeMount(async () => {
  const res = await getItemStat({
    subjectDetails: store.subjectDetails,
    username: store.username
  });
  rightData.right = JSON.parse(res.data.data[0][store.subjectDetails]).right;
  rightData.false = JSON.parse(res.data.data[0][store.subjectDetails]).false;
})
// 图表配置
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const pieDom = ref(null);
const rightData = reactive({
  right: 0,
  false: 0,
})
const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '3%',
    left: 'center',
  },
  series: [
    {
      name: '练习情况',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        formatter: '{b}{c}',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 30,
          fontWeight: 'bold',
        }
      },
      labelLine: {
        show: false
      },
      color: ['#42b883', "#ccc"
      ],
      data: [
        { value: finishedTotal.value, name: '已做' },
        { value: store.total - finishedTotal.value, name: '未做' }
      ]
    }
  ]
};

const rightRate = computed(() => {
  return Math.round((rightData.right / (rightData.right + rightData.false)) * 100) || 0;
})
const falseRate = computed(() => {
  return Math.round((rightData.false / (rightData.right + rightData.false)) * 100) || 0;
})

onMounted(() => {
  // 渲染图表
  const myChart = echarts.init(pieDom.value);
  option && myChart.setOption(option);
})

// 清除统计
const clearTestStat = async () => {
  popup({
    title: '清除统计',
    content: '您确定要清除练习统计吗'
  }).then(async () => {
    window.localStorage.removeItem(store.subjectDetails)
    await clearItemStat({
      subjectDetails: store.subjectDetails,
      username: store.username,
    })
    store.setArchive();
    rightData.value = {
      right: 0,
      false: 0
    }
    reload();
  })
}
</script>

<style lang='less' scoped>
.pie {
  margin-top: 45px;
}

ul {
  text-align: center;

  h2 {
    font-size: 20px;
  }

  li {
    margin: 10px 0;
  }

  li:nth-of-type(2) {
    margin-bottom: 20px;
  }

  .normal-font {
    margin: 0 30px;
    font-size: 14px;
  }

  .right-font {
    color: #42b883;
    font-size: 26px;
  }

  .false-font {
    color: #ccc;
    font-size: 26px;
  }
}
</style>
