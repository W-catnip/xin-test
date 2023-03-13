<template>
  <router-view v-if="isRouterAlive"></router-view>
  <div v-if="!isRouterAlive" class="errorView">
    <svg-icon name="error" fill="#056DE8" width="300" height="300"></svg-icon>
    <p>PC端开发中...请使用移动端打开该网页</p>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useQueryStore } from './stores/index';
import { useRouter } from 'vue-router';
import { watch, onMounted, nextTick, provide, ref, onBeforeMount } from 'vue';
import { verify } from './http/api/user';
import { getError } from './http/api/items';
import { popup } from './components/Popup';

const store = useQueryStore()
const router = useRouter();
watch(() => {
  // 监听当前route的名称
  return router.currentRoute.value.name;
}, (value) => {
  // 改变headerTitle
  store.SetHeaderTtile(value);
});

// 重新渲染组件 刷新用
const isRouterAlive = ref(true);

// 刷新后定向到首页
router.push('/')

onMounted(async () => {
  // 查询是否为电脑端打开
  if (window.screen.width > 640) {
    isRouterAlive.value = false;
    return;
  }
  const token = window.localStorage.getItem('token') || '';
  const res = await verify(token);
  store.logged = res.data.status == 0 ? true : false;
  if (store.logged) {
    store.username = window.localStorage.getItem('username');
    await getError(store);
  }
})

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

.errorView {
  text-align: center;
  width: 160px;
  margin: 30px auto;
}

p {
  font-size: 4px;
}
</style>
