// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MyServer from '@/plugins/http.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// base.css
import '@/assets/css/base.css'
Vue.use(ElementUI)
Vue.use(MyServer)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
