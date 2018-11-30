// 配置axios插件
import axios from 'axios'
axios.defaults.baseURL='http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前判断请求路径，是否提供token令牌
  // console.log(config.url)
  if(config.url!='login'){
    var AUTH_TOKEN = localStorage.getItem("token");
      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
    config.headers["Authorization"] = AUTH_TOKEN;

  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

const MyAxios={};
MyAxios.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
      // 逻辑...
    }
  
    // 2. 添加全局资源
    Vue.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {
        // 逻辑...
      }
    })
  
    // 3. 注入组件
    Vue.mixin({
      created: function () {
        // 逻辑...
      }
    })
    // 4. 添加实例方法
    Vue.prototype.$axios = axios
  }
  export default MyAxios