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
              <!-- 编辑 -->
              <el-button
                plain
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editUserShow(scope.row.id)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                plain
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delUser(scope.row.id)"
              ></el-button>

              <!-- 分配角色 -->
              <el-button plain size="mini" type="success" icon="el-icon-check" circle
              @click="rolsShow(scope.row.id)"></el-button>
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

    <!-- 编辑用户页面 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible">
      <el-form :model="form" label-position="right">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input :disabled="disabled" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogRolFormVisible">
      <el-form :model="form1">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{form1.username}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form1.rid">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <!-- 角色列表 -->
            <el-option v-for="(item,i) in roleList" :label="item.roleName" 
            :value="item.id" 
            :key="i">
            </el-option>
            
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRolFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="disRole()">确 定</el-button>
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
      dialogEditFormVisible: false,
      dialogRolFormVisible:false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "80px",
      // 搜索框禁用
      disabled: true,
      // 编辑用户id
      editUserId: -1,

      // 分配角色form1表单
      form1:{
        rid:-1
      },
      // 角色列表
      roleList:[],
      
    };
  },

  methods: {
    // 更改每页的条数，触发函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      // 显示第一页
      this.pagenum = 1;
      this.getUsers();
    },
    // 点击每一页面触发函数
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
      // token令牌封装
      const res = await this.$axios.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status == 200) {
        // 如果当前页面没有用户信息，页面前一页，解决删除问题
        if (data.users.length == 0) {
          --this.pagenum;
          this.getUsers();
        }
        this.tableData = data.users;
        this.total = data.total;
      }
    },

    // 修改状态
    async changeStatus(type, id) {
      const res = await this.$axios.put(`users/${id}/state/${type}`);
      // console.log(res);
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
      // this.form={}
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = "";
        }
      }
    },
    // 添加用户
    addUser() {
      this.dialogAddFormVisible = false;
      this.$axios.post("users", this.form).then(res => {
        // console.log(res);
        const {
          meta: { msg, status }
        } = res.data;
        if (status == 201) {
          this.$message.success(msg);
          this.getUsers();
          this.form = {};
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 显示用户编辑页
    async editUserShow(id) {
      const res = await this.$axios.get(`users/${id}`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status == 200) {
        this.form.username = data.username;
        this.form.email = data.email;
        this.form.mobile = data.mobile;
        this.editUserId = id;
      }
      this.dialogEditFormVisible = true;
    },
    // 用户编辑
    async editUser() {
      const res = await this.$axios.put(`users/${this.editUserId}`, this.form);
      // console.group(`更新成功响应数据:`);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.$message.success(msg);
        this.dialogEditFormVisible = false;
        this.getUsers();
      } else {
        this.$message.error(msg);
      }
    },

    // 搜索用户
    searchUser() {
      this.getUsers();
    },
    // 清空搜索关键字
    clearWords() {
      this.query = "";
      this.getUsers();
    },
    // 删除用户
    delUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`users/${id}`);
          const {
            meta: { msg, status }
          } = res.data;
          console.log(status);
          if (status == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 更新页面
            this.getUsers();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示角色分配弹出框
    async rolsShow(id){
      this.dialogRolFormVisible=true
      // 获取用户角色信息
      const res0= await this.$axios.get(`users/${id}`)
      // console.log(res0)
      this.form1=res0.data.data

      // 获取角色列表
      const res= await this.$axios.get('roles')
      // console.log(res)
      const {data,meta:{msg,status}}=res.data
      if(status==200){
        this.roleList=data
      }
    },
    //分配角色
    async disRole(){
      const res=await this.$axios.put(`users/${this.form1.id}/role`,this.form1)
      console.log(res)
      const {msg,status}=res.data.meta
      if(status==200){
        this.$message.success(msg)
        this.dialogRolFormVisible=false
      } else {
        this.$message.error(msg)
      }
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
