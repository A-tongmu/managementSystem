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
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo home_aside"
          :unique-opened="true"
          :router="true">
          <!-- 用户管理 -->
          <el-submenu v-for="(item,i) in menus" :index="i+''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="(item1,i) in item.children" :index="item1.path">
              <i class="el-icon-menu"></i>{{item1.authName}}
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
  data () {
    return {
      menus:[]
    }
  },
  methods: {
    // 退出登录
    homeOut() {
      this.$message("退出成功！");
      // 清除localStorage
      localStorage.removeItem('token');
      this.$router.push({ name: "login" });

    }, 
    // 获取侧边栏导航
    async getAside() {
      const res = await this.$axios.get("menus");
      // console.log(res);
      this.menus=res.data.data
    }
  },
  // beforeCreate() {
  //   var loginedMsg = localStorage.getItem("token");
  //   if (!loginedMsg) {
  //     this.$message.error("请登录后访问");
  //     this.$router.push({ name: "login" });
  //   }
  // },
  created () {
   
    this.getAside()
  }
 

};
</script>

<style>
.home_container {
  background-color: #e9eef3;
  height: 100%;
}
.home_header {
  background-color: #b3c0d1;
  line-height: 60px;
}
.home_aside {
  background-color: #fff;
}
.home_header .el-col:nth-child(1) img {
  margin-left: -20px;
  vertical-align: top;
}
.home_header .el-col:nth-child(2) {
  text-align: center;
  color: #fff;
}
.home_header .el-col:nth-child(3) {
  text-align: right;
}
</style>
