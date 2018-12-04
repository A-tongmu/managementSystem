<template>
  <!-- 分类参数 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>

    <!-- 添加分类 -->
    <el-button style="margin:10px 0px;" type="success" plain @click="addCateShow()">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="320">
      <!-- 树状表格插件
        treeKey -> nodekey -> 节点唯一标识 id
        parentKey -> 父节点的id
        levelKey -> 当前节点的级别
      childKey -> 子节点-->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        width="350"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="16"
      ></el-tree-grid>

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

    <!-- 添加分类弹出层 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <!-- 级联选择器 -->
          <el-cascader
            :options="options"
            change-on-select
            @change="handleChange"
            expand-trigger="hover"
            v-model="selectedOptions"
            clearable
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
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
      pagesize: 5,

      dialogFormVisible: false,
      form: {
        name: ""
      },
      formLabelWidth: "100px",
      options: [],
      // 级联选择器选中的数据
      selectedOptions: [],
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
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
    // 所有商品数据列表
    async getCategories() {
      const res = await this.$axios.get("categories?type=3");
      // console.log(res);
      this.tableData = res.data.data;
    },
    // 弹出添加商品分类页面
    async addCateShow() {
      this.dialogFormVisible = true;
      // 获取三级数据
      const res = await this.$axios.get("categories?type=2");
      console.log(res);
      this.options = res.data.data;
    },
    // 联级复选框内容变化时
    handleChange(value) {
      // console.log(value);
    },
    // 添加分类
    async addCate() {
      // cat_pid	分类父 ID	不能为空
      // cat_name	分类名称	不能为空
      // cat_level	分类层级	不能为空
      if (this.selectedOptions.length == 0) {
        var res = await this.$axios.post("categories", {
          cat_pid: 0,
          cat_name: this.form.name,
          cat_level: 0
        });
        console.log(res);
      } else if (this.selectedOptions.length == 1) {
        var res = await this.$axios.post("categories", {
          cat_pid: this.selectedOptions[0],
          cat_name: this.form.name,
          cat_level: 1
        });
        console.log(res);
      } else if (this.selectedOptions.length == 2) {
        var res = await this.$axios.post("categories", {
          cat_pid: this.selectedOptions[1],
          cat_name: this.form.name,
          cat_level: 2
        });
        console.log(res);
      }
      // 判断结果
      if (res.data.meta.status == 201) {
        this.$message.success("创建成功");
        this.dialogFormVisible = false;
        this.form.name = "";
        this.selectedOptions = [];
        this.getCategories()
      } else {
        this.$message.error(res.data.meta.msg);
      }
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
