<template>
  <!-- 分类参数 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>

    <el-alert
      style="margin:20px 0px"
      :closable="false"
      title="注意:只允许为第三级分类设置参数"
      type="warning"
      show-icon
    ></el-alert>

    <!-- 选择商品 -->
  <el-form :model="form" label-position="right">
    <el-form-item label="请选择商品分类" label-width="120px">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
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
