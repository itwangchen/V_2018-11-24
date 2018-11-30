import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import User from '@/components/user/User'
import Roles from '@/components/roles/Roles'
import Rights from '@/components/rights/Rights'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'user', path: '/user', component: User},
        {name: 'roles', path: '/roles', component: Roles},
        {name: 'rights', path: '/rights', component: Rights}
      ]
    }
  ]
})
