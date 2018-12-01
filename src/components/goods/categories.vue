<template>
  <!-- 分类参数 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>

    <!-- 添加分类 -->
    <el-button style="margin:10px 0px;" type="success" plain>添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="320">
      <el-table-column prop="cat_name" label="分类名称" width="350"></el-table-column>

      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level==0">一级</span>
          <span v-if="scope.row.cat_level==1">二级</span>
          <span v-if="scope.row.cat_level==2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted==true">无效</span>
          <span v-if="scope.row.cat_deleted==false">有效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除 -->
            <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页符 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 当前页
      currentPage: 1,
      // 总条数
      total: 10,
      // 当前页面
      pagenum: 1,
      // 每页条数
      pagesize: 5
    };
  },
  methods: {
    // 每页的条数改变时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
    },
    // 当前页改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
    },
    // 商品数据列表
    async getCategories() {
      const res = await this.$axios.get("categories?type=1");
      console.log(res);
      this.tableData = res.data.data;
    }
  },
  mounted() {
    this.getCategories();
  }
};
</script>

<style >
.box-card {
  height: 100%;
}
</style>
