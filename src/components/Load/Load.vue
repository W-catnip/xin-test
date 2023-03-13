<!--
 * Load
 * @author: Catnip
 * @since: 2023-03-08
 * src\components\Load\Load.vue
-->
<template>
  <transition>
    <div class="loading" v-if="visible">
      <img src="../../assets/load.gif" alt="">
    </div>
</transition>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const setVisible = (bool) => {
  visible.value = bool;
}
defineExpose({
  setVisible,
  visible
})
</script>

<style lang='less' scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #cccccc68;

  img {
    background-color: #fff;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    margin: 250px auto;
  }
}
</style>
