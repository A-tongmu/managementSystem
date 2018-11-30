<template>
  <el-card class="box-card right_card">
    <!-- 顶部面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="rightsData" stripe style="width: 100%" height="450">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==0">一级</span>
          <span v-if="scope.row.level==1">二级</span>
          <span v-if="scope.row.level==2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsData: []
    };
  },
  methods: {
    async getRight() {
      const res = await this.$axios.get("rights/list");
    //   console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.rightsData = data;
      } else {
        this.$message.error(msg);
      }
    }
  },
  mounted() {
    this.getRight();
  }
};
</script>

<style>
.right_card {
  height: 100%;
}
</style>
