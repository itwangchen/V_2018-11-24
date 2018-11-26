// axios 插件
import axios from 'axios'
// 配置baseUrl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
let myServer = {}
myServer.install = function (Vue) {
  Vue.prototype.$http = axios
}
export default myServer
