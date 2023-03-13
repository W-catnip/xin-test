import { createRouter, createWebHistory } from 'vue-router'
import Message from '../components/Message';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: 'default',
          name: 'default',
          component: () => import('../views/DefaultView.vue'),
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('../views/UserView.vue'),
        }
      ]
    },
    {
      path: '/normal',
      name: 'normal',
      component: () => import('../views/NormalView.vue')
    },
    {
      path: '/exam',
      name: 'exam',
      component: () => import('../views/ExamView.vue')
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('../views/SignIn.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    },
    {
      path: '/teststat',
      name: 'testStat',
      component: () => import('../views/TestStat.vue')
    },
    {
      path: '/examstat',
      name: 'examStat',
      component: () => import('../views/ExamStat.vue')
    }]
})

router.beforeEach(async (to, from, next) => {
  if (!window.localStorage.getItem('token') && to.name !== 'home' && to.name !== 'user' && to.name !== 'default' && to.name !== 'sign' && to.name !== 'normal') {
    router.push('default');
    Message.info('请登录以解锁更多功能');
  } else {
    next()
  }
})

export default router
