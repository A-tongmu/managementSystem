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
                clearable
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
      <!-- 动态参数 -->
      <el-tab-pane class="pane" name="2" label="商品参数">
        <el-form v-for="(item,i) in arrDyParam" :key="i" label-position="top" label-width="80px">
          <el-form-item :label="item.attr_name">
            <el-checkbox-group v-model="checkList">
              <!-- 多选项 -->
              <el-checkbox v-for="(item1,i) in item.attr_vals" :key="i" :label="item1" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 静态参数 -->
      <el-tab-pane class="pane" name="3" label="商品属性">
        <el-form label-position="top" label-width="80px">
          <el-form-item v-for="(item,i) in arrStaticParam" :key="i" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane class="pane" name="4" label="商品图片">
        <el-upload
          :headers="headers"
          multiple
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeAvatarUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane class="pane" name="5" label="商品内容">
        <el-button type="primary" plain>添加商品</el-button>
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
        ></quill-editor>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
// 引入富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

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
        pics: [],
        attrs: []
      },
      // 当前选择的进度
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
      },
      // 请求头
      headers: {
        Authorization: localStorage.getItem("token")
      },
      // 动态参数选择项
      checkList: [],
      arrDyParam: [],
      // 静态参数选择项
      arrStaticParam: [],
      // 富文本编辑器
      content: "",
      editorOption: {
        // 一些配置项
        placeholder:"商品内容..."
      }
    };
  },
  methods: {
    // tab切换时触发函数
    async checkTab() {
      if (this.active != "1" && this.selectedOptions.length != 3) {
        this.$message.warning("请选择商品的三级分类");
        return;
      }
      // 获取动态参数
      var id = this.selectedOptions[2];
      if (this.active == "2") {
        if (id) {
          const res = await this.$axios.get(
            `categories/${id}/attributes?sel=many`
          );
          console.log("动态参数");
          console.log(res);
          const {
            data,
            meta: { msg, status }
          } = res.data;
          // 将attr_vals参数处理成数组
          for (var i = 0; i < data.length; i++) {
            if (data[i].attr_vals != "") {
              data[i].attr_vals = data[i].attr_vals.split(",");
              data[i].attr_vals.forEach(element => {
                this.checkList.push(element)
              });
            } else {
              data[i].attr_vals = [];
            }
          }

          this.arrDyParam = data;
        }
      }
      // 获取静态参数
      if (this.active == "3") {
        if (id) {
          const res1 = await this.$axios.get(
            `categories/${id}/attributes?sel=only`
          );
          console.log("静态参数");
          console.log(res1);
          this.arrStaticParam = res1.data.data;
        }
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
      // console.log(res);
      this.options = res.data.data;
    },
    // 文件上传
    // fileList:上传多个文件时的文件列表信息
    // file：单个文件信息
    handleSuccess(response, file, fileList) {
      // console.log(response , file, fileList);
      if (file.status == "success") {
        // file.response.data.tmp_path 临时路径
        var tmp_upPath = file.response.data.tmp_path;
        this.form.pics.push({ pic: tmp_upPath });
      }
    },
    // 文件移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
      var tmp_removePath = file.response.data.tmp_path;
      var index = this.form.pics.findIndex(item => {
        return item.pic == tmp_removePath;
      });
      this.form.pics.splice(index, 1);
      console.log(this.form.pics);
    },
    // 点击文件列表中已上传的文件时的钩子
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
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isLt2M;
    }
  },
  created() {
    this.getCategories();
  },
  components: {
    quillEditor
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
.quill-editor {
 height: 240px;
 
 
}
.ql-container {
 height: 200px;
 }
.limit {
 height: 30px;
 border: 1px solid #ccc;
 line-height: 30px;
 text-align: right;
}
 
.ql-snow .ql-editor img {
 max-width: 480px;
}
 
.ql-editor .ql-video {
 max-width: 480px;
}
</style>
