// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MyServer from '@/plugins/http.js'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
// 导入面包屑组件
import Mybread from '@/components/common/Mybread'
// base.css
import '@/assets/css/base.css'
Vue.use(ElementUI)
Vue.use(MyServer)
Vue.config.productionTip = false
// 定义全局组件
Vue.component(Mybread.name, Mybread)
Vue.filter(
  // 时间格式化
  'fData', function (D) {
    return moment(D).format('YYYY-MM-DD')
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
