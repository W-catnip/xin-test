<!--
 * TestView
 * @author: Catnip
 * @since: 2023-03-02
 * src\views\TestView.vue
-->
<template>
  <Header>{{ headerTitle }}</Header>
  <ScrollTabCol :setItems="setItems" @afterMove="setPositions" @setChosen="setChosen"></ScrollTabCol>
  <Footer :positions="positions" :archive="archive" @setScroll="setScroll" @setCurrItem='setCurrItem'>
</Footer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
import ScrollTabCol from '../components/scroll/ScrollTabCol.vue';
import { useQueryStore } from '../stores';
import { ref, watch } from 'vue';
import { getItem } from '../http/api/items';
const store = useQueryStore();
const { headerTitle } = storeToRefs(store);
const data = ref(null);

// 题目模板位置设置
let positions = ref({});
const setPositions = (value) => {
  positions.value = value;
}
// 重设Data的序号
const resetID = (data) => {
  for (let key in data) {
    data[key].index = Number(key) + 1;
  }
}

const setCurr = async (store, id = store.currId - 1) => {
  if (!data.value) {
    store.sort = 'random';
    store.pagesize = 10;
    const res = await getItem(store);
    data.value = res.data;
    store.total = data.value.length;
    resetID(data.value);
  }
  const curr = data.value[id];
  store.itemData[positions.value.curr] = curr;
}
const setPrev = (store, id = store.currId - 2) => {
  const prev = data.value[id];
  store.itemData[positions.value.prev] = prev;
}
const setNext = (store, id = store.currId) => {
  const next = data.value[id];
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
const archive = ref({});
const setChosen = (obj) => {
  const chosen = JSON.parse(JSON.stringify(obj.chosen))
  archive.value[store.currId] = {
    chosen,
    isRight: obj.isRight
  }
  if (!obj.isRight) {
    store.recordError({
      username: store.username,
      subjectDetails: store.subjectDetails,
      details: archive.value[store.currId],
      id: store.itemData[positions.value.curr].id
    });
  }
}

// 控制页面滚动
const scroll = ref(false);
const setScroll = (value) => {
  scroll.value = value;
}
</script>

<style lang='less' scoped></style>
