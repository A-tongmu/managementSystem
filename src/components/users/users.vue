<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <div style="margin-top: 15px;">
      <el-row>
        <el-col :span="12">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="query"
            class="input-with-select users_search"
            @clear="clearWords()"
            >
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
          </el-input>
          <el-button type="success" plain @click="addUserShow()">添加用户</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData" style="width: 100%" max-height="320">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>

        <!-- 创建日期 -->
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">{{scope.row.create_time|fmtdate}}</template>
        </el-table-column>

        <!-- 状态操作 -->
        <el-table-column label="用户状态" width="120">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus($event,scope.row.id)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 用户增删改 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户页面 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddFormVisible">
      <el-form :model="form" label-position="right">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, //首屏显示页面
      query: "", //查询参数
      pagenum: "1", //当前页码
      pagesize: "2", //每页显示条数
      total: 1,
      // 状态控制
      value: true,
      // 显示添加弹出框
      dialogAddFormVisible: false,
      form: {
        username: "",
        password:"",
        email:"",
        mobile:""
      },
      formLabelWidth:"80px"
    };
  },
// username	用户名称	不能为空
// password	用户密码	不能为空
// email	邮箱	可以为空
// mobile	手机号	可以为空
  methods: {
    // 更改每页的条数，触发函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getUsers();
    },
    // 点击没一页面触发函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUsers();
    },

    //   获取用户数据

    // 参数名	参数说明	备注
    // query	查询参数	可以为空
    // pagenum	当前页码	不能为空
    // pagesize	每页显示条数	不能为空
    async getUsers() {
      var AUTH_TOKEN = localStorage.getItem("token");
      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      this.$axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      var res = await this.$axios.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status == 200) {
        this.tableData = data.users;
        this.total = data.total;
      }
    },

    // 修改状态
    async changeStatus(type, id) {
      const res = await this.$axios.put(`users/${id}/state/${type}`);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },

    // 显示添加用户
    addUserShow() {
      this.dialogAddFormVisible = true;
    },
    // 添加用户
    addUser(){
        this.dialogAddFormVisible = false;
        this.$axios.post('users',this.form)
        .then((res)=>{
            console.log(res)
            const {meta:{msg,status}}=res.data
            if(status==201){
                this.$message.success(msg)
                this.getUsers()
                this.form={}
            } else {
                this.$message.error(msg)
            }

        })
    },
    // 搜索用户
    searchUser(){
        this.getUsers()
    },
    // 清空搜索关键字
    clearWords(){
        this.query=''
        this.getUsers()
    }

  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.users_search {
  width: 360px;
}
</style>
