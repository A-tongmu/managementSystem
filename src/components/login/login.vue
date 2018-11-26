<template>
  <div class="login_container">
    <el-form
      class="login_form"
      :label-position="labelPosition"
      label-width="80px"
      :model="formLabelAlign"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.username" placeholder="username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formLabelAlign.password" placeholder="password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login_button" @click="login()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
      return {
        labelPosition: 'top',
        formLabelAlign: {
          username: 'admin',
          password: '123456'
        }
      };
    },
    methods: {
        // 登录
        login(){
            this.$axios.post('login',this.formLabelAlign)
            .then((res) => {
                console.log(res)
                const {data,meta:{msg,status}}=res.data
                if(status==200){
                    this.$message.success('登录成功');
                    // 登录成功设置localStorage
                    localStorage.setItem('token',data.token)
                    // 调转到home页
                    this.$router.push({name:'home'})
                } else {
                    this.$message.error(msg);
                }
                
            }).catch((err) => {
                this.$alert(err, '警告',{
                    confirmButtonText: '确定'
                });
            });
        }
        // es7 async+await简化代码
        // ,async login (){
        //     const res =await this.$axios.post('login',this.formLabelAlign)
      
        //     console.log(res)
        //     const {data,meta:{msg,status}}=res.data
        //     if(status==200){
        //         this.$message.success('登录成功');
        //         // 登录成功设置localStorage
        //         localStorage.setItem('token',data.token)
        //     } else {
        //         this.$message.error(msg);
        //     }
                

        // }
    }
}
</script>

<style>
    .login_container{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-color: #324152;
       
    }
    .login_form{ 
        padding: 20px 40px 40px;
        width: 550px;
        background-color: #fff;
        border-radius: 10px;
    }
    .login_button{
        width: 100%;
    }
</style>
