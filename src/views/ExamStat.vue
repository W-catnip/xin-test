<!--
 * ExamStat
 * @author: Catnip
 * @since: 2023-03-07
 * src\views\ExamStat.vue
-->
<template>
  <Header>{{ headerTitle }}</Header>
  <div class="line" style="margin-top:20px">
    <div ref="lineDom" class="lineDom"></div>
  </div>
  <div class="content">
    <h2>{{ subText }}考试记录</h2>
    <ul>
      <li class="item" v-for="(item, index) in   examArr" :key="item.date">
        <div class="left-box">
          <div class="serial">{{ index + 1 }}</div>
          <div class="date-box">
            <div>{{ item.date }}</div>
            <div>用时：{{ item.cost }}</div>
          </div>
          <div class="score-font">
            {{ item.score }}分
          </div>
        </div>
        <div>
          {{ item.nickName }}
        </div>
      </li>
    </ul>
    <div v-if="examArr.length == 0" class="item">
      <p>暂无考试记录</p>
    </div>
  </div>
  <div class="btn-box">
    <button class="clear-btn confirm-btn" @click="clearStat">清除考试数据</button>

</div>
</template>

<script setup>
import Header from '../components/Header.vue';
import { storeToRefs } from 'pinia';
import { useQueryStore } from '../stores';
import { ref, onMounted, onBeforeMount, computed, watch, reactive } from 'vue';
import { clearExamStat, getExamStat } from '../http/api/statistics.js';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { popup } from '../components/Popup';
const store = useQueryStore();
const { headerTitle, subText, examArr, scoresArr } = storeToRefs(store);
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

const lineDom = ref(null);
const myChart = ref(null);


const option = reactive({
  xAxis: {
    type: 'category',
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      margin: 12,
      textStyle: {
        fontSize: 14
      }
    },
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  yAxis: {
    min: 0,
    type: 'value',
    axisLabel: {
      margin: 10,
      textStyle: {
        fontSize: 14
      }
    }
  },
  series: [
    {
      label: {
        show: true
      },
      name: '考试记录',
      data: scoresArr.value,
      type: 'line'
    }
  ]
});
watch(() => scoresArr.value,
  (value) => {
    option.series[0].data = value;
    myChart.value.setOption(option, { notMerge: true });
  })

onMounted(() => {
  myChart.value = echarts.init(lineDom.value);
  option && myChart.value.setOption(option);
})

const clearStat = async () => {
  popup({
    title: '清除记录',
    content: '您确定要清除考试记录吗'
  }).then(async () => {
    await clearExamStat({
      username: store.username,
      subjectDetails: store.subjectDetails
    })
  })
}
</script>

<style lang='less' scoped>
.lineDom {
  width: 375px;
  height: 300px;
}

.content {
  width: 340px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 10px;

  h2 {
    background-color: @orange;
    border-radius: 5px 5px 0 0;
    color: #fff;
    padding: 10px 0;
  }

  .item {
    padding: 14px 10px;
    border-top: 1px solid #ddd;
    .flex(@jc: space-between);

    .left-box {
      .flex(@jc: space-between);
      width: 70;
    }

    .serial {
      border: 1px solid #ccc;
      background-color: @green;
      color: #fff;
      border-radius: 3px;
      width: 24px;
      height: 24px;
    }

    .date-box {
      margin-left: 10px;
      margin-right: 45px;

      div {
        text-align: left;
      }

      div:first-of-type {
        margin-bottom: 5px;
      }
    }

    .score-font {
      font-weight: 500;
      font-size: 20px;
    }

    p {
      width: 100%;
      text-align: center;
    }
  }

}

.btn-box {
  margin-top: 30px;
  text-align: center;
}
</style>
