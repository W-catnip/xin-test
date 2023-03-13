<!--
 * 用户页
 * @author: Catnip
 * @since: 2022-11-04
 * UserView.vue
-->
<template>
  <div class="container user-box">
    <div class="profile">
      <img src="../assets/用户.png" width="70" height="70" alt="">
      <label for="profile">
        <input name="profile" type="file" accept="image/png, image/jpeg">
      </label>
    </div>
    <div class="name-box">
      <div class="nickname" @click="signin">{{ store.username }}</div>
      <div class="signature">您的学车之旅，我们一路相伴</div>
    </div>
  </div>
  <ul class="tab">
    <li>
      <svg-icon name="comment" :width="px2vw(22)" :height="px2vw(22)"></svg-icon><span>意见反馈</span>
    </li>
    <li>
      <svg-icon name="about" :width="px2vw(22)" :height="px2vw(22)"></svg-icon><span>关于产品</span>
    </li>
    <li v-if="store.logged" @click="out">
      <svg-icon name="out" :width="px2vw(22)" :height="px2vw(22)"></svg-icon><span>退出登录</span>
    </li>
</ul>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Message from '../components/Message';
import { popup } from '../components/Popup';
import { useQueryStore } from '../stores';

const store = useQueryStore();
const router = useRouter();
const signin = () => {
  if (!store.logged) {
    router.push({ name: 'sign' })
  }
}
const emit = defineEmits(['reload']);
// 退出登录
const out = () => {
  popup({
    content: '您确定要退出登录吗',
    title: '退出登录'
  }).then(() => {
    Message.success('已退出登录')
    store.username = '点击登录'
    window.localStorage.clear();
    store.logged = false;
    emit('reload');
  }).catch(() => { })
}
</script>

<style lang='less' scoped>
.user-box {
  .flex(@jc: flex-start);
  border-bottom: 6px solid #eee;

  .profile {
    margin: 8px 20px 8px 0;
    margin-right: 20px;
    height: 70px;
    border: 1px solid #ccc;
    border-radius: 50%;
  }

  .name-box {
    .nickname {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .signature {
      color: #bbb;
    }
  }
}

.tab {
  li {
    padding: 14px;
    .flex(@jc: flex-start);
    border-bottom: 1px solid #ddd;

    span {
      font-size: 15px;
      margin-left: 10px;
    }
  }
}

input {
  display: none;
}
</style>
