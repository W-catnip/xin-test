<!--
 * 默认页
 * @author: Catnip
 * @since: 2022-11-04
 * DefaultView.vue
-->
<template>
  <router-view></router-view>
  <!-- 标题栏 -->
  <div class="header">
    <h1>XIN驾考</h1>
    <div class="type">{{ type }}</div>
  </div>
  <!-- 导航栏 -->
  <div class="banner">
    <div class="select">
      <div @click="changeSub(true)" :class="{ chosen: subOne }">科目一</div>
      <div @click="changeSub(false)" :class="{ chosen: !subOne }">科目四</div>
    </div>
    <!-- 滑块 -->
    <div class="slider" ref="slider"></div>
  </div>
  <!-- 内容 -->
  <div class="content">
    <!-- 左栏 -->
    <ul class="left_ban">
      <router-link :to="{ path: '/normal', query: { sort: 'random' } }" custom v-slot="{ navigate }">
        <li @click="navigate">随机练习</li>
      </router-link>
      <router-link to="/test" custom v-slot="{ navigate }">
        <li @click="navigate">随时小测</li>
      </router-link>
      <router-link to="/examstat" custom v-slot="{ navigate }">
        <li @click="navigate">考试记录</li>
      </router-link>
    </ul>
    <!-- 中间栏 -->
    <div class="middle_ban">
      <div class="practice">
        <div>
          <router-link to="/normal" custom v-slot="{ navigate }">
            <p @click="navigate">顺序练习</p>
          </router-link>
          <p><span>{{ finishedTotal }}</span><span>/</span><span>{{ total }}</span></p>
        </div>
      </div>
      <div class="exam">
        <div>
          <router-link to="/exam" custom v-slot="{ navigate }">
            <p @click="navigate">模拟考试</p>
          </router-link>
          <p>平均成绩：{{ average }}</p>
        </div>
      </div>
    </div>
    <!-- 右栏 -->
    <ul class="right_ban">
      <router-link to="/error" custom v-slot="{ navigate }">
        <li @click="navigate">收藏题集</li>
      </router-link>
      <router-link to="/teststat" custom v-slot="{ navigate }">
        <li @click="navigate">练习统计</li>
      </router-link>
      <li @click="setOptionShow()">
        选择题库
        <transition>
          <div :class="{ option: optionShow }" v-show="optionShow">
            <div @click="setType(true)">A1</div>
            <div @click="setType(false)">C1</div>
          </div>
        </transition>
      </li>
    </ul>
</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, watchEffect, onMounted, computed, onBeforeMount } from 'vue';
import { getError, getItem } from '../http/api/items';
import { getExamStat } from '../http/api/statistics';
import { useQueryStore } from '../stores';
const store = useQueryStore();
const { type, total, examArr, average } = storeToRefs(store);
let subOne = ref(true);
let slider = ref(null);
const finishedTotal = computed(() => {
  return Object.keys(archive.value).length;
})
const archive = ref({})
watchEffect(() => {
  archive.value = JSON.parse(window.localStorage.getItem(store.subjectDetails)) || {};
})
// 更改科目
const changeSub = async (bool) => {
  subOne.value = bool;
  const sliderEl = slider.value;
  sliderEl.style.left = bool ? '25%' : '75%';
  const sub = bool ? 1 : 4;
  store.subject = sub;
  await getItem(store);
}
// 获取考试数据
onBeforeMount(async () => {
  if (store.logged) {
    const res = await getExamStat({
      subjectDetails: store.subjectDetails,
      username: store.username
    })
    examArr.value = JSON.parse(res.data.data[0].scores)[store.subjectDetails];
  }
  examArr.value.forEach(item => {
    if (item.score < 60) {
      item.nickName = '马路杀手'
    } else if (item.score < 90) {
      item.nickName = '再接再厉'
    } else {
      item.nickName = '学有所成'
    }
  })
})

onMounted(() => {
  if (store.subject == 1) {
    changeSub(true);
  } else {
    changeSub(false);
  }
})
const optionShow = ref(false);
const setOptionShow = () => {
  optionShow.value = optionShow.value ? false : true;
}

const setType = async (bool) => {
  store.type = bool ? 'A1' : 'C1';
  store.setArchive();
  await getError(store);
}
</script>

<style lang='less' scoped>
.header {
  .flex(@jc: space-between);

  .type {
    padding-right: 13px;
  }
}

h1 {
  font-size: 20px;
  padding-left: 13px;
}

.banner {
  position: relative;
}

.select {
  .flex;
  border-bottom: 1px solid #cccccc49;
  padding: 7px 0;

  div {
    text-align: center;
    width: 50%;
    height: 50%;
    opacity: .5;
  }

  .chosen {
    opacity: 1;
  }
}

.slider {
  position: absolute;
  border-radius: 5px;
  bottom: 1px;
  left: 25%;
  translate: -50%;
  width: 16px;
  height: 4px;
  background-color: cyan;
  transition: all .2s ease-out;
}

// 内容
.content {
  .flex(@jc: space-evenly; @ai: flex-start);
  height: 380px;
  margin-top: 25px;

  // 中间栏
  .middle_ban {
    .flex(@fd: column);

    .practice,
    .exam {
      color: #fff;
      font-family: '黑体';
      margin: 30px 0;
      .flex();
      text-align: center;
      width: 135px;
      height: 135px;
      border-radius: 50%;
    }

    .practice {
      background-color: rgba(91, 173, 241, 0.812);
    }

    .exam {
      background-color: rgba(101, 255, 188, 0.925);
    }
  }

  // 左边栏及右边栏
  .left_ban,
  .right_ban {
    flex-grow: 1;
    height: 100%;
    .flex(@fd: column; @jc: space-between; );

    li {
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 80px;
      height: 30px;
    }

    .option {
      border: 1px solid #ccc;
      border-radius: 0 0 5px 5px;
      border-top: none;
      transform: translateY(1);

      div:first-child {
        border-bottom: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: all .3s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
