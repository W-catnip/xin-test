<!--
 * normalView
 * @author: Catnip
 * @since: 2022-11-14
 * NormalView.vue
-->
<template>
  <HeaderVue>{{ headerTitle }}</HeaderVue>
  <ScrollTabCol :set-items="setItems" @setChosen="setChosen" @afterMove="setPositions"></ScrollTabCol>
  <!-- 底部 -->
  <FooterVue :positions="positions" :archive="archive" @setScroll="setScroll" @setCurrItem='setCurrItem'>
</FooterVue>
</template>

<script setup>
import HeaderVue from '../components/Header.vue';
import { useQueryStore } from '../stores/index';
import { ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { getItem } from '../http/api/items';
import FooterVue from '../components/Footer.vue';
import ScrollTabCol from '../components/scroll/ScrollTabCol.vue';
import { useRoute } from 'vue-router';
const store = useQueryStore();
const route = useRoute();
let positions = ref({})
const setPositions = (value) => {
  positions.value = value;
}

onUnmounted(() => {
  store.sort = 'normal'
})
// 获得滚动组件三个题目的数据
const setCurr = async (store, id = store.currId) => {
  store.sort = route.query.sort || 'normal';
  const curr = await getItem({ ...store, itemId: id })
  store.itemData[positions.value.curr] = curr.data[0]
};
const setPrev = async (store, id = store.currId - 1) => {
  const prev = await getItem({ ...store, itemId: id });
  store.itemData[positions.value.prev] = prev.data[0]
};
const setNext = async (store, id = store.currId + 1) => {
  const next = await getItem({ ...store, itemId: id });
  store.itemData[positions.value.next] = next.data[0]
}
const setItems = {
  setNext,
  setCurr,
  setPrev
}
// 获取子组件的选择情况后
const archive = ref(JSON.parse(window.localStorage.getItem(store.subjectDetails)) || {});
const setChosen = (obj) => {
  const chosen = JSON.parse(JSON.stringify(obj.chosen))
  archive.value[store.currId] = {
    chosen,
    isRight: obj.isRight
  }
  store.archive = archive.value;
  // 错误的话加入错题集
  if (!obj.isRight) {
    store.recordError({
      username: store.username,
      subjectDetails: store.subjectDetails,
      details: archive.value[store.currId],
      id: store.currId
    });
  }
  const details = JSON.stringify(archive.value)
  localStorage.setItem(store.subjectDetails, details)
}
const setCurrItem = async (id) => {
  await setCurr(store, id);
}
const { headerTitle } = storeToRefs(store);
// 通过添加position:fixed禁止滚动；
// 控制页面滚动
const scroll = ref(false);
const setScroll = (value) => {
  scroll.value = value;
}

</script>

<style lang='less' scoped></style>
