// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'

import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

// 引入样式
import './assets/css/base.css'

// 引入axios配置文件
import myAxios from './plugin/myAxios.js'

Vue.use(myAxios)

// 关闭开发模式
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
