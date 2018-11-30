// axios 插件
import axios from 'axios'
// 配置baseUrl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
let myServer = {}
myServer.install = function (Vue) {
  // 添加请求拦截器
  // 在发送请求之前做些什么
  axios.interceptors.request.use(function (config) {
    // 因login 不需要token 判断config中url请求路径为login 的时候不写入token
    if (config.url !== 'login') {
      // 写入token
      config.headers['Authorization'] = localStorage.getItem('token')
    }

    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}
export default myServer
