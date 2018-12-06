//路由的懒加载
import Vue from 'vue'
import VueRouter from 'vue-router'
const Login =()=> import('@/components/login/Login')
const Home =()=> import('@/components/home/Home')
const User =()=> import('@/components/user/User')
const Roles =()=> import('@/components/roles/Roles')
const Rights =()=> import('@/components/rights/Rights')
const goodslist =()=> import('@/components/goods/goodslist')
const goodsadd =()=> import('@/components/goods/goodsadd')
Vue.use(VueRouter)
let router = new VueRouter({
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
        { name: 'goodslist', path: '/goods', component: goodslist },
        { name: 'goodsadd', path: '/goodsadd', component: goodsadd }

      ]
    }
  ]
})
// 路由卫士拦截登录实现
router.beforeEach((to, from, next) => {
  // to 当前
  // 判断访问的组件如果是login 就进行下一步
  if (to.path === '/login') {
    next()
  }
  // 访问非登录页面,没有token
  if (!localStorage.getItem('token')) {
    router.push({ path: '/login' })
    return
  }
  // 访问非login,有token
  next()
})
export default router
