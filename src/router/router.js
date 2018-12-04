// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 引入组件
// 路由懒加载 const Foo = () => import('./Foo.vue')
const login = () => import  ('@/components/login/login.vue')
const home = () => import  ('@/components/home/home.vue')
const users = () => import  ('@/components/users/users.vue')
const right = () => import  ('@/components/rights/right.vue')
const role = () => import  ('@/components/rights/role.vue')
const goods = () => import  ('@/components/goods/goods.vue')
const params = () => import  ('@/components/goods/params.vue')
const categories = () => import  ('@/components/goods/categories.vue')
const goodsadd = () => import  ('@/components/goods/goodsadd.vue')
const orders = () => import  ('@/components/order/orders.vue')
const reports = () => import  ('@/components/reports/reports.vue')


import {Message} from 'element-ui'

const router = new VueRouter({
  routes: [{
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'home',
      path: '/',
      component: home,
      children: [{
          name: 'users',
          path: '/users',
          component: users
        },
        {
          name: 'rights',
          path: '/rights',
          component: right
        },
        {
          name: 'roles',
          path: '/roles',
          component: role
        },
        {
          name: 'goods',
          path: '/goods',
          component: goods
        },
        {
          name: 'params',
          path: '/params',
          component: params
        },
        {
          name: 'categories',
          path: '/categories',
          component: categories
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: goodsadd
        },
        {
          name: 'orders',
          path: '/orders',
          component: orders
        },
        {
          name: 'reports',
          path: '/reports',
          component: reports
        }
      ]

    }

  ]
})
// 注册全局前置守卫，进行token验证
router.beforeEach((to, from, next) => {
  // console.log(to)
  if(to.path!='/login'){
    var loginedMsg = localStorage.getItem("token");
    if (!loginedMsg) {
      Message.error("请登录后访问");
      router.push({ name: "login" });
      return
    }
  }
  next()
})


export default router
