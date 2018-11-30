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
    <el-table :data="goodsData" height="400" border style="width: 100%">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="600"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建日期"></el-table-column>
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsData: []
    };
  },

  methods: {
    // 获取商品
    async getGoods() {
       const res = await this.$axios.get(`goods?pagenum=1&pagesize=50`)
       console.log(res)
        const {data,meta:{msg,status}}=res.data
        if(status==200){
            this.goodsData=data.goods
        }
    },
    // 搜索商品
    searchGoods() {},
    // 添加商品
    addGoodsShow() {}
  }
  ,mounted () {
      this.getGoods()
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
