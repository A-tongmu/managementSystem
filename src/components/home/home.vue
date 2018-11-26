<template>
  <el-container class="home_container">
      <!-- 头部 -->
    <el-header class="home_header">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
              <img src="../../assets/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
              <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
              <a href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
        <!-- 侧边栏 -->
      <el-aside width="200px" class="home_aside">Aside</el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    methods: {
        
    },
    mounted () {
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
