<!--
 * SignIn
 * @author: Catnip
 * @since: 2023-02-10
 * src\views\SignIn.vue
-->
<template>
  <Header>
    {{ signTitle }}
  </Header>
  <div class="formgroup container">
    <label class="input">
      <input type="text" maxlength="20" placeholder="请输入用户名" v-model="userinfo.username">
    </label>
    <label class="input">
      <input type="password" maxlength="20" placeholder="请输入密码（不少于八位）" v-model="userinfo.password">
    </label>
    <label class="input" v-if="!isSignIn">
      <input type="password" maxlength="20" placeholder="请确认密码" v-model="userinfo.confirm">
    </label>
    <button class="confirm-btn" @click="submit">确定</button>
  </div>
<p class="toSignUp" @click="toSignUp">{{ footerText }}</p>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { signUp, signIn } from '../http/api/user'
import Header from '../components/Header.vue';
import { useQueryStore } from '../stores';
import { useRouter } from 'vue-router';
import Message from '../components/Message';
const isSignIn = ref(true);
const signTitle = ref('登录');
const footerText = ref('没有账号？去注册');
const store = useQueryStore();
const router = useRouter();
const userinfo = reactive({
  username: null,
  password: null,
  confirm: null
})
// 登录注册转换
const toSignUp = () => {
  if (isSignIn.value) {
    isSignIn.value = false;
    signTitle.value = '注册';
    footerText.value = '已有账号？去登录'
  } else {
    isSignIn.value = true;
    signTitle.value = '登录';
    footerText.value = '没有账号？去注册'
  }
}
// 提交
const submit = async () => {
  // 检验格式是否正确
  let remark = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,8}$/;
  let remarkPassword = /^[a-zA-Z0-9_-]{8,18}$/
  for (let key of Object.keys(userinfo)) {
    if (key == 'confirm' && isSignIn.value) {
      continue;
    }
    if (!userinfo[key]) {
      Message.info('请填写用户名与密码')
      return;
    }
  }
  if (!remark.test(userinfo.username)) {
    Message.info('昵称限2-8个字符，支持汉字、字母、数字及下划线')
    return;
  }
  if (!remarkPassword.test(userinfo.password)) {
    Message.info('密码限8-18位字符，仅支持字母、数字及下划线以及连接符')
    return
  }
  if (!isSignIn.value && userinfo.password !== userinfo.confirm) {
    Message.info('两次输入的密码不一致')
    return
  }
  if (isSignIn.value) {
    const res = await signIn(userinfo);
    if (res.data.status == 0) {
      store.username = userinfo.username;
      store.logged = true;
      router.replace({ path: '/user' });
    }
  } else {
    await signUp(userinfo);
  }
}
</script>

<style lang='less' scoped>
.formgroup {
  text-align: center;
  margin: 45px auto 0 auto;
  width: 300px;

  .input {
    .flex();
    width: 100%;
    height: 48px;
    padding: 0;
    color: #8590A6;
    border-bottom: 1px solid #EBEBEB;
    border-radius: 0;

    input {
      -webkit-box-flex: 1;
      background: transparent;
      outline: none;
      border: none;
      -ms-flex: 1 1;
      flex: 1 1;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      overflow: hidden;
      padding: 0;
      resize: none;
    }
  }

  .confirm-btn {
    margin-top: 30px;
  }
}

.toSignUp {
  font-size: 13px;
  color: #bbb;
  text-align: center;
}
</style>
