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
      <el-form-item label="选择商品分类">
        <div class="block">
          <el-cascader
            expand-trigger="hover"
            :show-all-levels="false"
            :options="options"
            :props="props"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </div>
      </el-form-item>
    </el-form>

    <!-- tab栏 -->
    <el-tabs v-model="active" @tab-click="handleClick">
      <!-- 动态参数 -->
      <el-tab-pane label="动态参数" name="first">
        <el-button size="mini" type="primary" :disabled="arrDyParam.length!=0?false:true">设置动态参数</el-button>
        <el-table :data="arrDyParam" stripe style="width: 100%" height="280">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item>
                  <!-- 添加属性 -->
                  <el-tag
                    :key="tag"
                    v-for="tag in props.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag,props.row)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="#" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
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
      </el-tab-pane>
      <!-- 静态参数 -->
      <el-tab-pane label="静态参数" name="second">
        <el-button size="mini" type="primary" :disabled="arrStaticParam.length!=0?false:true">设置静态参数</el-button>
        <el-table :data="arrStaticParam" stripe style="width: 100%" height="280">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="180"></el-table-column>
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
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
      active: "first",
      // 动态参数选择项
      arrDyParam: [],
      // 静态参数选择项
      arrStaticParam: [],
      //  表格

      // 添加属性
      dynamicTags: [],
      inputVisible: false, //输入框文字是否不可见
      inputValue: "" //默认提示文字
    };
  },
  methods: {
    // 级联选中项改变时触发
    async handleChange(value) {
      console.log(value);
      this.selectedOptions = value;

      var id = this.selectedOptions[2];
      // 获取动态参数
      const res = await this.$axios.get(`categories/${id}/attributes?sel=many`);
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
        } else {
          data[i].attr_vals = [];
        }
      }
      this.arrDyParam = data;
      console.log(this.arrDyParam);

      // 获取静态参数
      var id = this.selectedOptions[2];
      // 获取静态参数
      const res1 = await this.$axios.get(
        `categories/${id}/attributes?sel=only`
      );
      console.log("静态参数");
      this.arrStaticParam = res1.data.data;
      console.log(this.arrStaticParam);
    },
    // 获取商品分类信息
    async getCategories() {
      const res = await this.$axios.get("categories?type=3");
      // console.log(res);
      this.options = res.data.data;
    },
    // tab栏切换时
    async handleClick(tab, event) {
      // console.log(tab, event);
      if (this.selectedOptions.length != 3) {
        this.$message.warning("请选择商品的三级分类");
        return;
      }
    },
    // 添加标签相关方法
    async handleClose(tag,dyParam) {
      dyParam.attr_vals.splice(dyParam.attr_vals.indexOf(tag), 1);
      // 删除参数
      var form={
          attr_name:dyParam.attr_name,
          attr_sel:'many',
          attr_vals:dyParam.attr_vals.join(',')
        }
        const res = await this.$axios.post(`categories/${dyParam.attr_id}/attributes`,form)
        console.log(res)
    },

    showInput() {
      this.inputVisible = true;
      // 获取dom最新数据
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(dyParam) {
      console.log(dyParam)
      let inputValue = this.inputValue;
      if (inputValue) {
        dyParam.attr_vals.push(inputValue);

        // 发送请求
        // :id	分类 ID	不能为空携带在url中
        // attr_name	参数名称	不能为空
        // attr_sel	[only,many]	不能为空
        // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
        var form={
          attr_name:dyParam.attr_name,
          attr_sel:'many',
          attr_vals:dyParam.attr_vals.join(',')
        }
        const res = await this.$axios.post(`categories/${dyParam.attr_id}/attributes`,form)
        console.log(res)

      }
      this.inputVisible = false;
      this.inputValue = "";
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
