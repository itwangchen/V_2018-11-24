<template>
    <el-card class="box-card">
        <el-card slot="header" class="clearfix">
            <!-- 头 -->
            <!-- 将头部抽离出来设置为全局组件 -->
            <my-bread class="title" level1="商品管理" level2="商品列表">

            </my-bread>
            <el-alert class="addTitle" title="添加商品信息" type="info" center show-icon>
            </el-alert>
            <el-steps :active="active*1" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
            </el-steps>
            <!-- 表单部分 -->
            <el-form label-position="top" :model="form">
                <!-- tabs -->
                <el-tabs @tab-click="tabClick" v-model="active" tab-position="left" style="height: 450px; overflow: auto;">
                    <el-tab-pane name="1" label="基本信息">
                        <!--
                            goods_name	商品名称	不能为空
                            goods_cat	以为','分割的分类列表	不能为空
                            goods_price	价格	不能为空
                            goods_number	数量	不能为空
                            goods_weight	重量	不能为空
                            goods_introduce	介绍	可以为空
                            pics	上传的图片临时路径（对象）	可以为空
                            attrs	商品的参数（数组）
                            商品分类 -->
                        <el-form-item label="商品名称">
                            <el-input v-model="form.goods_name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <el-input v-model="form.goods_price">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品重量">
                            <el-input v-model="form.goods_weight">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                            <el-input v-model="form.goods_number">
                            </el-input>
                        </el-form-item>
                        {{selectedOptions}}
                        <el-form-item label="商品分类">
                            <el-cascader expand-trigger="hover" :props="prop" :options="options" v-model="selectedOptions"
                                @change="handleChange">
                            </el-cascader>
                           
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane name="2" label="商品参数">
                        <!-- attr_id: 3077
                            attr_name: "版式"
                            attr_sel: "many"
                            attr_vals: "aa,bb,cc,ee"
                            attr_write: "list"
                            cat_id: 6 -->
                        <el-form-item :label="item.attr_name" :key="I" v-for="(item,I) in arrDyparams">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="ite" border :key="i" size="medium" v-for="(ite,i) in item.attr_vals"></el-checkbox>

                            </el-checkbox-group>

                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane name="3" label="商品属性">
                        <el-form-item v-for="(item,i) in arrStaticparams" :label="item.attr_name">
                            <el-input v-model="item.attr_vals">
                            </el-input>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane name="4" label="商品图片">
                        <el-upload action="http://localhost:8888/api/private/v1/upload" :headers="tokenHeaders"
                            :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane name="5" label="商品内容">
                        <el-button @click="handelAdd" type="success" plain>添加商品</el-button>
                        <quill-editor v-model="form.goods_introduce">

                        </quill-editor>
                    </el-tab-pane>
                </el-tabs>

            </el-form>
        </el-card>
    </el-card>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      // 当前进度
      active: '1',
      form: {
        goods_name: '', //	商品名称	不能为空
        goods_price: '', // 价格	不能为空
        goods_number: '', //	数量	不能为空
        goods_weight: '', //	重量	不能为空
        goods_introduce: '', //	介绍	可以为空

        goods_cat: '',	// 以为','分割的分类列表	不能为空
        attrs: [],	// 商品的参数（数组）
        // 上传的图片临时路径（对象）	可以为空
        pics: []

      },
      // 文件路径列表
      fileList: [],
      // 三级选框数据源
      options: [],
      // 绑定级联选值
      selectedOptions: [],
      // 级联配置项
      prop: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数的数据
      arrDyparams: [],
      // 静态参数的数据
      arrStaticparams: [],
      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      tokenHeaders: {
        'Authorization': localStorage.getItem('token')
      }
    }
  },
  components: {
    quillEditor
  },
  async beforeMount () {
    // 在实例挂载之前改变数据
    let res = await this.$http.get(`categories`)
    let { data, meta: { status, msg } } = res.data
    if (status === 200) {
      this.options = data
    } else {
      this.$message.error(msg)
    }
  },

  methods: {
    async  handelAdd () {
      // 将三级选框数据进行拼接
      this.form.goods_cat = this.selectedOptions.join(',')
      let res = await this.$http.post(`goods`, this.form)
      let { data, meta: { msg, status } } = res.data
      if (status === 201) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    async tabClick () {
      let thisIndex = this.active
      if (thisIndex * 1 === 2) {
        // 判断是否选择了级联选框
        if (this.selectedOptions.length === 3) {
          // 获取商品参数
          let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          let { data, meta: { status, msg } } = res.data
          data.forEach(el => {
            el.attr_vals = el.attr_vals.split(',')
          })
          this.arrDyparams = data
          // console.log(data);
        } else {
          this.$message.error('请选择商品分类!')
        }
      } else if (thisIndex * 1 === 3) {
        let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)

        let { data, meta: { status, msg } } = res.data
        this.arrStaticparams = data
      }
    },
    // 级联选择器改变触发的事件
    handleChange (val) {

    },
    // 删除图片
    handleRemove (file, fileList) {
      console.log(file, fileList, this.form.pics)
      // 对已上传的文件数组 进行判断 选出file 中的,进行删除
      // console.log(file.name);
      // 返回删除的文件路径在pics 中的索引
      let index = this.form.pics.findIndex((el) => {
        return el.pic === file.response.data.tmp_path
      })
      // 将处理好的数组重新赋值给pics
      this.form.pics = this.form.pics.splice(index, 1)
    },
    handlePreview (file) {
      // console.log(file);
    },
    // 上传成功
    handleSuccess (file, fileList) {
      // "pics":[
      // {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
      // ],
      this.form.pics.push({ 'pic': file.data.tmp_path })
    }
  }
}

</script>
<style>
    .title {
        margin-bottom: 20px;
    }

    .addTitle {
        margin-bottom: 20px;
    }
</style>
