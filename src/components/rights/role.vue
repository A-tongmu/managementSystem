<template>
  <el-card class="box-card role_card">
    <!-- 顶部面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加角色 -->
    <el-button class="addRol" type="primary" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleData" style="width: 100%" height="450">
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- 第一级菜单循环 -->
            <el-row v-for="(item,i) in props.row.children" :key="i">
              <el-col :span="4">
                <el-tag @close="delRight(props.row,item.id)" closable>{{item.authName}}</el-tag>
                <span class="dayu">></span>
              </el-col>
              <el-col :span="20">
                <!-- 第二级菜单循环 -->
                <el-row v-for="(item2,i) in item.children" :key="i">
                  <el-col :span="4">
                    <el-tag @close="delRight(props.row,item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                    <span class="dayu">></span>
                  </el-col>
                  <el-col :span="20">
                    <!-- 第三级菜单循环 -->
                    <el-row>
                      <el-col :span="24">
                        <el-tag @close="delRight(props.row,item3.id)"
                          type="warning"
                          v-for="(item3,i) in item2.children"
                          :key="i"
                          closable
                        >{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- 无数据时显示提示 -->
            <span v-if="props.row.children.length==0">未分配权限</span>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <!-- 用户增删改 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除 -->
            <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>

            <!-- 分配角色 -->
            <el-button
              plain
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="disRight(scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限分配页 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRight">
      <el-tree
        ref="rightsTree"
        :data="rightData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedRights"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="editRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleData: [],
      rightData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 打开权限分配页
      dialogFormVisibleRight:false,
      // 选中的权限
      checkedRights:[],
      // 角色授权，当前角色id
      currRoleId:-1
    };
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      const res = await this.$axios.get("roles");
      // console.log(res)
      const {data,meta: { msg, status }} = res.data;
      if (status == 200) {
        this.roleData = data;
        // console.log(data)
      }
    },
    // 删除权限
    async delRight(role,rightId){
      const res = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      // 当前角色剩余权限 res.data.data
      const {data,meta:{msg,status}}=res.data
      if(status==200){
        this.$message.success(msg)
        // 更新视图
        role.children=data
      } else {
        this.$message.error(msg)
      }

    },

    // 显示权限分配页面
    async disRight(role) {
      this.dialogFormVisibleRight=true
      // 获取权限树状图
      const res= await this.$axios.get('rights/tree')
      // console.log(res)
      this.rightData=res.data.data

      // 赋值当前角色id，角色授权时使用
      this.currRoleId=role.id

      // 获取角色的权限id
      var arr=[]
      role.children.forEach(element => {
        // arr.push(element.id)
        element.children.forEach(element1 => {
          // arr.push(element1.id)
          element1.children.forEach(element2 => {
            arr.push(element2.id)
          });
        });
      });
      // console.log(arr)
      this.checkedRights=arr


    },
    // 角色授权
    async editRight(){
      // getCheckedKeys  返回目前被选中的节点的 key 所组成的数组
      // getHalfCheckedKeys  返回目前半选中的节点的 key 所组成的数组
      var arr1 = this.$refs.rightsTree.getCheckedKeys()
      // console.log(arr1)
      var arr2 = this.$refs.rightsTree.getHalfCheckedKeys()
      // console.log(arr2)
      // es6展开运算符
      var totalRights=[...arr1,...arr2]
      // console.log(totalRights)
      const res = await this.$axios.post(`roles/${this.currRoleId}/rights`,
      {rids:totalRights.join(',')})
      console.log(res)
      const {msg,status}=res.data.meta
      if(status==200){
        this.dialogFormVisibleRight = false
        this.$message.success(msg)
        // 更新视图
        this.getRoles();

      } else {
        this.$message.error(msg)
      }
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>

<style>
.addRol {
  margin-top: 20px;
}
.role_card {
  height: 100%;
}
.dayu {
  font-family: "宋体";
  margin-left: 5px;
}
</style>
