<!--
 * ErrorView
 * @author: Catnip
 * @since: 2023-02-24
 * src\views\ErrorView.vue
-->
<template>
  <Header>{{ headerTitle }}</Header>
  <ScrollTabCol :setItems="setItems" @afterMove="setPositions" @setChosen="setChosen"></ScrollTabCol>
  <Footer isError="true" :positions="positions" :archive="errorArchive" @setScroll="setScroll" @setCurrItem='setCurrItem'>
  </Footer>
<div v-if="!store.errorData.length" class="mask">还没有错题哦</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, inject } from 'vue';
import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
import ScrollTabCol from '../components/scroll/ScrollTabCol.vue';
import { getError, getItem } from '../http/api/items';
import { useQueryStore } from '../stores';
const store = useQueryStore();
const { headerTitle } = storeToRefs(store);

// 题目模板位置设置
let positions = ref({});
const setPositions = (value) => {
  positions.value = value;
}
// 控制页面滚动
const scroll = ref(false);
const setScroll = (value) => {
  scroll.value = value;
}

const setID = (store, id) => {
  const index = id - 1;
  const obj = store.errorData[index];
  return Object.keys(obj)[0];
}
// 获得要渲染的数据
const setCurr = async (store, id = store.currId) => {
  if (!store.errorData.length) {
    await getError(store);
    store.total = store.errorData.length;
  }
  const index = setID(store, id);
  const curr = await getItem({ ...store, itemId: index });
  curr.data[0].index = id;
  store.itemData[positions.value.curr] = curr.data[0];
}
const setPrev = async (store, id = store.currId - 1) => {
  const index = setID(store, id);
  const prev = await getItem({ ...store, itemId: index });
  prev.data[0].index = id;
  store.itemData[positions.value.prev] = prev.data[0];
}
const setNext = async (store, id = store.currId + 1) => {
  const index = setID(store, id);
  const next = await getItem({ ...store, itemId: index });
  next.data[0].index = id;
  store.itemData[positions.value.next] = next.data[0];
}

const setCurrItem = async (id) => {
  await setCurr(store, id - 1);
}

const setItems = {
  setPrev,
  setCurr,
  setNext
}

const errorArchive = ref({})
// 答题组件的选择回调
const setChosen = (obj) => {
  const chosen = JSON.parse(JSON.stringify(obj.chosen))
  errorArchive.value[store.currId] = {
    chosen,
    isRight: obj.isRight
  }
}
// 监听

onMounted(async () => {
  await getError(store);
  store.total = store.errorData.length;
})

</script>

<style lang='less' scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 500px;
  background-color: rgb(255, 255, 255);
}
</style>
