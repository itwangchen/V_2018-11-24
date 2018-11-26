// axios 插件
import axios from 'axios'
let myServer = {}
myServer.install = function (Vue) {
  Vue.prototype.$http = axios
}
export default myServer
