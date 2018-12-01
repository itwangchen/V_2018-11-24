import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import User from '@/components/user/User'
import Roles from '@/components/roles/Roles'
import Rights from '@/components/rights/Rights'
import goodslist from '@/components/goods/goodslist'
import goodsadd from '@/components/goods/goodsadd'
Vue.use(Router)
let router = new Router({
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
        { name: 'user', path: '/users', component: User },
        { name: 'roles', path: '/roles', component: Roles },
        { name: 'rights', path: '/rights', component: Rights },
        { name: 'goodslist', path: '/goods', component: goodslist},
        {name: 'goodsadd', path: '/goodsadd', component: goodsadd}
    
      
      ]
    }
  ]
})
//路由卫士拦截登录实现
router.beforeEach((to, from, next) => {
  // to 当前
  //判断访问的组件如果是login 就进行下一步
  if (to.path === '/login') {
    next()
  }
  //访问非登录页面,没有token
  if (!localStorage.getItem('token')) {
    router.push({ path: '/login' })
    return
  }
  //访问非login,有token
  next()
})
export default router
