<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 头 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" class="top_title">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 搜索 -->
            <el-row>
                <el-col :span="12" class="userserach">
                    <el-input v-model="search_Input" placeholder="请输入内容"></el-input>
                    <el-button icon="el-icon-search" type="success" @click.prevent="handleSearch"></el-button>
                </el-col>
                <!-- 添加 -->
                <el-col :span="3">
                    <el-button type="success" @click="addFormVisible = true" class="serach" plain>Add</el-button>
                    <!-- 添加用户弹出层 -->
                    <el-dialog title="添加用户" :visible.sync="addFormVisible">
                        <el-form :model="addForm" label-position="left">
                            <el-form-item label="用户名">
                                <el-input v-model="addForm.username"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="addForm.password"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="电话">
                                <el-input v-model="addForm.mobile"></el-input>
                            </el-form-item>

                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addItem">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <template>
                <el-table :data="tableData" style="width: 100%" current-row-key>
                    <el-table-column type="index" prop="id" label="#" width="50">
                    </el-table-column>
                    <el-table-column prop="username" label="姓名" width="100">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" width="180">
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话" width="180">
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建日期" width="180">
                    </el-table-column>
                    <el-table-column label="用户状态">
                        <template slot-scope="props">
                            <el-switch v-model="props.row.mg_state" active-color="#13ce66" @change="handleState(props.row.mg_state,props.row.id)"
                                inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="props">
                            <!-- 编辑 -->
                            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleEdit(props.row.id)"></el-button>
                            <!-- 角色 -->
                            <el-button type="success" icon="el-icon-check" circle size="mini" @click="handleRole(props.row.id)"></el-button>
                            <!-- 删除 -->
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelete(props.row.id)"></el-button>
                            <!-- 编辑弹出层 -->
                            <el-dialog title="编辑用户" :visible.sync="EditFormVisible">
                                <el-form class="editWrap" :label-position="leftposition" label-width="80px" :model="editForm">
                                    <el-form-item label="用户名">
                                        <el-input v-model="editForm.username" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱">
                                        <el-input v-model="editForm.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="电话">
                                        <el-input v-model="editForm.mobile"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" class="editBtn" @click="handleEditOK">确定</el-button>
                                    <el-button class="editBtn" @click="EditFormVisible=false">取消</el-button>
                                </el-form>

                            </el-dialog>
                            <!-- 角色弹出层 -->
                            <el-dialog title="角色选择" :visible.sync="RoleFormVisible">

                                <el-select v-model="region" placeholder="角色选择">

                                    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in RoleList"></el-option>

                                </el-select>
                                <el-button type="primary" class="editBtn" @click="handleRoleOK(props.row.id)">确定</el-button>
                                <el-button class="editBtn" @click="RoleFormVisible=false">取消</el-button>

                            </el-dialog>
                        </template>
                    </el-table-column>
                </el-table>

            </template>
            <!-- 分页 -->
            <template>
                <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="thisPageNum"
                        :page-sizes="page_sizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total"></el-pagination>
                    </el-pagination>
                </div>
            </template>
        </div>
    </el-card>
</template>
<script>
export default {
  data () {
    return {
      // 表格数据
      tableData: [],
      // 角色
      RoleList: [],
      pagenum: 1,
      pagesize: 6,
      search_Input: '',
      // 增加层弹出状态
      addFormVisible: false,
      // 编辑弹出层状态
      EditFormVisible: false,
      // 角色弹出层状态
      RoleFormVisible: false,
      // 角色id
      region: '',
      // 被设置的用户的Id
      RoleId: '',
      // 增加数据
      addForm: {},
      // 编辑用户
      editForm: {},
      thisPageNum: 1,
      // 设置可选择条数
      page_sizes: [6, 12, 18],
      // 数据条数
      total: 1,
      statusB: true,
      leftposition: 'left'
    }
  },

  beforeMount () {
    // 写入token
    this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    this.getList()
  },
  methods: {
    // 获取用户列表方法
    async   getList (pagenum, pagesize, search_Input) {
      // 默认搜索空,获取全部数据
      let { data: { data: { users, total }, meta: { msg, status } } } = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.search_Input}`)
      this.tableData = users
      users.forEach(e => {
        e.create_time = this.dateBase(e.create_time)
      })

      // 总数据条数
      this.total = total
    },
    // 定义补0 方法
    bLing (num) {
      return num >= 10 ? num : '0' + num
    },
    dateBase: function (date) {
      // 处理时间 转化为时分秒
      var dates = new Date(date)
      var f = this.bLing(dates.getFullYear())
      var m = this.bLing(dates.getMonth() + 1)
      var d = this.bLing(dates.getDate())
      return `${f}年${m}月${d}日`
    },
    // 添加用户
    async addItem () {
      let { data: { meta: { msg, status } } } = await this.$http.post('users', this.addForm)
      // 添加结果处理
      if (status === 201) {
        this.addFormVisible = false
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },

    // 分页更改
    handleSizeChange (val) {
      this.pagesize = val
      this.getList()
    },
    // 页数跳转
    handleCurrentChange (val) {
      this.pagenum = val
      this.getList()
    }, // 搜索功能
    async  handleSearch () {
      this.getList()
    },
    // 状态改变
    async handleState (state, I) {
      let { data: { meta: { msg, status } } } = await this.$http.put(`users/${I}/state/${state}`)
      if (status == 200) {
        this.$message.success(msg)
        this.getList()
      } else {
        this.$message.error(msg)
      }
    },

    // 删除
    async handleDelete (I) {
      let { data: { meta: { status, msg } } } = await this.$http.delete(`users/${I}`)
      if (status === 200) {
        this.$message.success(msg)
        this.getList()
      } else {
        this.$message.error(msg)
      }
    },
    // 编辑
    async handleEdit (I) {
      let res = await this.$http.get(`users/${I}`)
      if (res.data.meta.status === 200) {
        // 弹出层
        this.EditFormVisible = true
        this.editForm = res.data.data
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 确认编辑
    async handleEditOK () {
      // 当前editForm 中存在Id 是点击编辑的时候获取的
      let res = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.EditFormVisible = false
        this.getList()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 角色编辑
    async handleRole (I) {
      this.RoleId = I
      // 查询角色列表
      let res = await this.$http.get(`roles`)
      // 查询用户信息获取角色信息
      let r = await this.$http.get(`users/${I}`)
      if (res.data.meta.status === 200 && r.data.meta.status === 200) {
        this.RoleList = res.data.data
        this.RoleFormVisible = true
        this.region = r.data.data.rid
      }
    },
    // 确认选择角色
    async  handleRoleOK (I) {
      this.RoleFormVisible = false
      let userId = this.RoleId
      let rId = this.region
      let res = await this.$http.put(`users/${userId}/role`, { rid: rId })
      console.log(userId, rId)

      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
    }
  }
}
</script>
<style scoped>
    .userserach {
        display: flex;
    }

    .serach {
        margin-left: 20px;
    }

    .top_title {
        margin-bottom: 20px;
    }

    .editBtn {
        float: right;
        margin-left: 10px;
    }

    .editWrap {
        overflow: hidden;
    }
</style>
