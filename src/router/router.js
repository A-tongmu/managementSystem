// 配置路由
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 引入组件
import login from '@/components/login/login.vue'
import home from '@/components/home/home.vue'
import users from '@/components/users/users.vue'
import right from '@/components/rights/right.vue'
import role from '@/components/rights/role.vue'
import goods from '@/components/goods/goods.vue'
import params from '@/components/goods/params.vue'
import categories from '@/components/goods/categories.vue'
import goodsadd from '@/components/goods/goodsadd.vue'


import {Message} from 'element-ui'

const router = new Router({
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
