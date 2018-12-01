<template>
  <!-- 商品添加 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示消息 -->
    <el-alert style="margin:20px 0px" :closable="false" title="添加商品信息" type="info" show-icon center></el-alert>

    <!-- 步骤进度 -->
    <el-steps :active="1*active" align-center>
      <el-step title="基本信息" icon="el-icon-info"></el-step>
      <el-step title="商品参数" icon="el-icon-edit"></el-step>
      <el-step title="商品属性" icon="el-icon-success"></el-step>
      <el-step title="商品图片" icon="el-icon-picture"></el-step>
      <el-step title="商品内容" icon="el-icon-upload"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-tabs
      class="tabs"
      tab-position="left"
      style="height: 350px;"
      @tab-click="checkTab()"
      v-model="active"
    >
      <!-- v-model绑定是选中的tab name值 -->
      <el-tab-pane name="1" class="pane" label="基本信息">
        <el-form label-position="top" label-width="80px" :model="form">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <div class="block">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                :props="props"
                v-model="selectedOptions"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="2" label="商品参数">配置管理</el-tab-pane>
      <el-tab-pane name="3" label="商品属性">角色管理</el-tab-pane>

      <el-tab-pane name="4" label="商品图片">
        <el-upload
          multiple
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane name="5" label="商品内容">定时任务补偿</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
// 参数名	参数说明	备注
// goods_name	商品名称	不能为空
// goods_price	价格	不能为空
// goods_weight	重量	不能为空
// goods_number	数量	不能为空
// goods_cat	以为','分割的分类列表	不能为空
// goods_introduce	介绍	可以为空
// pics	上传的图片临时路径（对象）	可以为空
// attrs	商品的参数（数组）	可以为空
export default {
  data() {
    return {
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: "",
        attrs: []
      },
      //   当前选择的进度
      active: "1",
      // 级联选择器
      options: [],
      // 默认选中
      selectedOptions: [],
      // 配置项
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  methods: {
    // tab切换时触发函数
    checkTab() {
      if (this.active != "1" && this.selectedOptions.length != 3) {
        this.$message.warning("请选择商品的三级分类");
      }
    },
    // 级联选中项改变时触发
    handleChange(value) {
      console.log(value);
      this.selectedOptions = value;
    },
    // 获取商品分类信息
    async getCategories() {
      const res = await this.$axios.get("categories?type=3");
      console.log(res);
      this.options = res.data.data;
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 设置上传类型和大小
    beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!');
        }
        return isLt2M;
      }
  },
  created() {
    this.getCategories();
  }
};
</script>

<style >
.box-card {
  height: 100%;
}
.tabs .pane {
  height: 350px;
  padding-left: 20px;
  overflow: auto;
}
</style>
