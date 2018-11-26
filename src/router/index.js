import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 引入组件
import login from '../components/login/login.vue'
import home from '../components/home/home.vue';


export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    }
    ,{
      name: 'home',
      path: '/',
      component: home
    }
  ]
})
