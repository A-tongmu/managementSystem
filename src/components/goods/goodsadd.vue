<template>
  <!-- 商品添加 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示消息 -->
    <el-alert
      style="margin:20px 0px"
      :closable="false"
      title="添加商品信息"
      type="info"
      show-icon
      center
    ></el-alert>

    

  </el-card>
</template>

<script>
export default {
    data () {
        return {
            form:{}
        }
    }
};
</script>

<style >
.box-card {
  height: 100%;
}
</style>
