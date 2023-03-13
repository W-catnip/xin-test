<!--
 * Header
 * @author: Catnip
 * @since: 2023-01-03
 * src\components\Header.vue
-->
<template>
  <div class="header">
    <svg-icon class="icon-back" :width="px2vw(16)" name="back" @click="backward()"></svg-icon>
    <h2>
      <slot></slot>
    </h2>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const backward = () => {

  router.push('/default')
}
</script>

<style lang='less' scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 99;
  .flex();
  height: 45px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px 3px #eee;
}

h2 {
  font-size: 20px;
}

.icon-back {
  position: relative;
  left: -130px;
}
</style>
