<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header class="home_header">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent="homeOut()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="home_aside">
        <!-- 侧边栏 -->
        <el-menu default-active="2" class="el-menu-vertical-demo home_aside" :unique-opened="true" :router="true">
          <!-- 用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>用户列表
            </el-menu-item>
          </el-submenu>

          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>角色列表
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>权限列表
            </el-menu-item>
          </el-submenu>

          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>商品分类
            </el-menu-item>
          </el-submenu>

          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>订单列表
            </el-menu-item>
          </el-submenu>

          <!-- 数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    methods: {
        // 退出登录
        homeOut(){
            this.$message('退出成功！')
            this.$router.push({name:'login'})
        }
    },
    beforeCreate () {
      var loginedMsg=localStorage.getItem('token')
        if(!loginedMsg){
            this.$message.error('请登录后访问')
            this.$router.push({name:'login'})
        }
    }
}
</script>

<style>
    .home_container{
        background-color: #E9EEF3;
        height: 100%;
    }
    .home_header{
        background-color: #B3C0D1;
        line-height: 60px;
    }
    .home_aside{
        background-color: #fff;
    }
    .home_header .el-col:nth-child(1) img{
        margin-left: -20px;
        vertical-align: top;
    }
    .home_header .el-col:nth-child(2){
        text-align: center;
        color:#fff;
    }
    .home_header .el-col:nth-child(3){
        text-align: right;
    }
</style>
