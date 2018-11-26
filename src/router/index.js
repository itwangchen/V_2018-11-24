import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    },
  ]
})
