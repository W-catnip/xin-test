<template><router-view v-if="isRouterAlive"></router-view></template>

<script setup>
import { RouterView } from 'vue-router';
import { useQueryStore } from './stores/index';
import { useRouter } from 'vue-router';
import { watch, onMounted, nextTick, provide, ref } from 'vue';
import { verify } from './http/api/user';
import { getError } from './http/api/items';

const store = useQueryStore()
const router = useRouter();
watch(() => {
  // 监听当前route的名称
  return router.currentRoute.value.name;
}, (value) => {
  // 改变headerTitle
  store.SetHeaderTtile(value);
});
// 刷新后定向到首页
router.push('/')

onMounted(async () => {
  const token = window.localStorage.getItem('token') || '';
  const res = await verify(token);
  store.logged = res.data.status == 0 ? true : false;
  if (store.logged) {
    store.username = window.localStorage.getItem('username');
    await getError(store);
  }
})
// 重新渲染组件 刷新用
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  })
}
provide('reload', reload)
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
