import axios from 'axios';
import Message from '../components/Message';
import serverConfig from './config';
import load from '../components/Load'

// 创建axios实例
const serviceAxios = axios.create({
  baseURL: serverConfig.baseURL,
  timeout: 5000,
  post: {
    'content-type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    // 请求头携带token
    let token = localStorage.getItem('token')
    config.headers.Authorization = token;
    if (config.url == '/user/signIn' || config.url == '/user/signUp') {
      load.show();
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
)

// 响应拦截
serviceAxios.interceptors.response.use(
  (response) => {
    // 给部分请求返回显示弹窗
    if (matchPopup(response.config.url)) {
      if (response.data.status == 0) {
        Message.success(response.data.message);
      } else {
        Message.error(response.data.message);
      }
    }
    load.hide();
    return response
  },
  (error) => {
    Promise.reject(error);
  }
)

// 弹窗显示规则
const matchPopup = (url) => {
  return url == '/items/error/update' || url == '/statistics/clearScores' ||
    url == '/user/signIn' || url == '/user/singUp' ||
    url == '/statistics/addScores' || url == '/statistics/clear'
}

export default serviceAxios;