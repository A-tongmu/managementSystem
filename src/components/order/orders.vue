<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData" style="width: 100%; marginTop:20px;" height="420" border>
        <el-table-column type="index" :index="getIndex()" label="#" width="60"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>

        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==0" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.order_pay==1" type="info">已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>

        <!-- 下单时间 -->
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">{{scope.row.update_time|fmtdate}}</template>
        </el-table-column>

        <!-- 操作 -->
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
                :props="props"
                @click="editShow()"
              ></el-button>
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 编辑弹出页 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区/县" :label-width="formLabelWidth">
          <el-cascader
            expand-trigger="hover"
            :options="gridData"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import city from "@/assets/js/city.js";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, //首屏显示页面
      query: "", //查询参数
      pagenum: "1", //当前页码
      pagesize: "10", //每页显示条数
      total: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        name: ""
      },
      // 级联选择器数据
      gridData: [],
      selectedOptions: [],
      props: {
        value: "value",
        label: "label",
        children: "children"
      }
    };
  },

  methods: {
    // 更改每页的条数，触发函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      // 显示第一页
      this.pagenum = 1;
      this.getOrders();
    },
    // 点击每一页面触发函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getOrders();
    },
    // 获取订单列表
    async getOrders() {
      const res = await this.$axios.get(
        `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      this.tableData = data.goods;
      this.total = data.total;
    },
    //设置序号
    getIndex() {
      return (this.pagenum - 1) * this.pagesize + 1;
    },
    // 显示订单编辑页
    editShow() {
      this.dialogFormVisible = true;
      this.gridData = city;
    },
    //级联选择器改变
    handleChange(value) {
      console.log(value);
    }
  },
  mounted() {
    this.getOrders();
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
