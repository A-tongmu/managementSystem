<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索栏 -->
    <div style="margin: 15px 0px;">
      <el-row>
        <el-col :span="12">
          <el-input
            clearable
            placeholder="请输入内容"
            class="input-with-select users_search"
            @clear="clearWords()"
          >
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
          </el-input>
          <!-- 添加商品 -->
          <el-button type="success" plain @click="addGoodsShow()">添加商品</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <el-table :data="goodsData" height="340" 
    border style="width: 100%" v-loading="loading">
      <el-table-column type="index" :index='testIndex()' label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="600"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>

      <el-table-column label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.add_time|fmtdate}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除 -->
            <el-button plain size="mini" type="danger" icon="el-icon-delete" 
            circle @click="delGood(scope.row.goods_id)"></el-button>
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
        :page-sizes="[50, 100, 150, 200]"
        :page-size="50"
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
      goodsData: [],
      // 当前页
      currentPage: 1,
      // 总条数
      total:-1,
      // 当前页面
      pagenum:1,
      // 每页条数
      pagesize:50,
      // 加载动画
      loading:true
    };
  },

  methods: {
    // 自定义索引
    testIndex(){
      return (this.pagenum-1)*this.pagesize+1
    },
    // 每页的条数改变时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize=val
      this.getGoods()
    },
    // 当前页改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagenum=val
      this.getGoods()
    },

    // 获取商品
    async getGoods() {
      const res = await this.$axios.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      // 获取总商品数
      this.total=data.total

      if (status == 200) {
        this.goodsData = data.goods;
        this.loading=false
      }
    },
    // 搜索商品
    searchGoods() {},
    // 添加商品
    addGoodsShow() {
      this.$router.push({name:'goodsadd'})
    },
    // 删除商品
    async delGood(id){
      const res = await this.$axios.delete(`goods/${id}`)
      console.log(res)
      const {msg,status}=res.data.meta
      if(status==200){
        this.getGoods()
      }
      this.$message.error(msg)
    }
  },
  mounted() {
    this.getGoods();
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
