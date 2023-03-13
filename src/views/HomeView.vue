<template>
  <div class="main">
    <router-view></router-view>
  </div>
  <ul class="footer">
    <router-link to="/default" custom v-slot="{ navigate }">
      <li @click="navigate">
        <svg-icon v-show="option1" name="test" fill="#42b883"></svg-icon>
        <svg-icon v-show="!option1" name="test"></svg-icon><span :class="{ chosen: option1 }">考试</span>
      </li>
    </router-link>
    <router-link to="/user" custom v-slot="{ navigate }">
      <li @click="navigate">
        <svg-icon v-show="option2" name="user" fill="#42b883"></svg-icon>
        <svg-icon v-show="!option2" name="user"></svg-icon><span :class="{ chosen: option2 }">我的</span>
      </li>
    </router-link>
  </ul>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { getItem } from '../http/api/items';
import { useQueryStore } from '../stores/index';
const store = useQueryStore()
const router = useRouter();
const route = useRoute();
const option1 = ref(true);
const option2 = ref(false);
watch(() => route.name,
  (value) => {
    if (value == 'user') {
      option1.value = false;
      option2.value = true;
    } else if (value == 'default') {
      option1.value = true;
      option2.value = false;
    }
  })
onMounted(async () => {
  router.push({ name: 'default' });
  await getItem(store);
})
</script>

<style lang="less">
.main {
  margin-bottom: 70px;
}

.footer {
  .flex();
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 -1px 3px #ccc;

  li {
    .flex(@fd: column);
    flex-grow: .5;
    transition: all .3s ease;
  }

  .chosen {
    color: #42b883;
  }
}
</style>